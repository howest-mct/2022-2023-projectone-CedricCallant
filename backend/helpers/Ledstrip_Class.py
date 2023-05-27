import neopixel
import board
import time

class Ledstrip:

    def __init__(self, pin=board.D18,ledcount = 120, pixel_order = neopixel.GRB) -> None:
        self.__pixel = neopixel.NeoPixel(pin,ledcount, pixel_order=pixel_order)
        self.__LEDRANGE = ledcount


    # ********** property pixel - (enkel getter) ***********
    @property
    def pixel(self) -> object:
        """ The pixel property. """
        return self.__pixel
    
    # ********** property LEDRANGE - (enkel getter) ***********
    @property
    def LEDRANGE(self) -> int:
        """ The LEDRANGE property. """
        return self.__LEDRANGE
    
    

    def pulse(self, color):
        self.pixel.fill(color)
        curr_br = self.pixel.brightness*100
        for i in range(int(curr_br),100,1):
            self.pixel.brightness = i/100.0
            time.sleep(0.01)
        curr_br = self.pixel.brightness*100
        for i in range(int(curr_br), 0,-1):
            self.pixel.brightness = i/100.0
            time.sleep(0.01)

    def wave(self, color):
        for i in range(0,self.LEDRANGE,1):
            self.pixel[i] = color
            time.sleep(0.01)
        for i in range(self.LEDRANGE,0,-1):
            self.pixel[i] = (0,0,0)
            time.sleep(0.01)

    def static(self, color):
        self.pixel.fill(color)

    def set_Brightness(self, brightness):
        if 0 < brightness <= 1:
            self.pixel.brightness= brightness
            return f'Brightness set to {brightness}'
        else:
            return 'Brightness needs to be a value between 0 and 1'

    def clear_leds(self):
        self.pixel.fill(0,0,0)

    def white_light(self, preference):
        if preference == 'warm':
            self.pixel.fill((253, 244, 220))
        elif preference == 'cold':
            self.pixel.fill((244, 253, 255))
        elif preference == 'sunlight':
            self.pixel.fill((244, 233, 155))
        else:
            self.pixel.fill((253, 254, 255))
