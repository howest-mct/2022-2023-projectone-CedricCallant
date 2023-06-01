import spidev

class Mcp:
    def __init__(self, bus, slave) -> None:
        self.spi = spidev.SpiDev()
        self.spi.open(bus,slave)
        self.spi.max_speed_hz = 10 ** 5
    
    def geefWaardes(self, kanaal):
            byte2 = (0b1000|kanaal) << 4
            bytes_out = (1,byte2, 0)
            bytes_in = self.spi.xfer(bytes_out)
            resultaat = ((0x3 & bytes_in[1])<<8)|bytes_in[2]
            return resultaat
        
    def close(self):
        self.spi.close()