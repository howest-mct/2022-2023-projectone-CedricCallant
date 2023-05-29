from smbus import SMBus

class Mpu6050:
    def __init__(self, i2c_adres) -> None:
        self.__adres = i2c_adres
        self.i2c = SMBus()
        self.i2c.open(1)
        self.setup()

    # ********** property adres - (enkel getter) ***********
    @property
    def adres(self) -> int:
        """ The adres property. """
        return self.__adres
    
    # ********** property i2c - (setter/getter) ***********
    @property
    def i2c(self) -> object:
        """ The i2c property. """
        return self.__i2c
    
    @i2c.setter
    def i2c(self, value: object) -> None:
        self.__i2c = value
    
    def naar_comp(self, waarde):
        if waarde & 0x8000:
            waarde-= 2**16
            return waarde
        else:
            return waarde

    def setup(self):
        self.i2c.write_byte_data(0x68,0x1c,0x00)
        self.i2c.write_byte_data(0x68,0x1c,0x00)
        self.i2c.write_byte_data(0x68,0x6B,0)

    def read_data(self):
        alles = []
        arr_temp = self.i2c.read_i2c_block_data(0x68, 0x41,2)
        arr_acc = self.i2c.read_i2c_block_data(0x68, 0x3b, 6)
        arr_gyro = self.i2c.read_i2c_block_data(0x68, 0x43, 6)
        alles.append(arr_temp)
        alles.append(arr_acc)
        alles.append(arr_gyro)
        temp = self.verwerk_temp(arr_temp)
        acc = self.verwerk_acc(arr_acc)
        gyr = self.verwerk_gyr(arr_gyro)
        return {"temp":temp,"acc":acc,"gyr":gyr}

    
    def verwerk_temp(self, arr):
        byte = (arr[0] <<8) | arr[1]
        return round((self.naar_comp(byte)/340) + 36.53,2)
        # print(f"De temperatuur is {round((self.naar_comp(byte)/340) + 36.53,2)}° Celsius")

    def verwerk_acc(self,arr):
        xbyte = (arr[0] << 8) | arr[1]
        ybyte = (arr[2] << 8) | arr[3]
        zbyte = (arr[4] << 8) | arr[5]
        return {'x': round(self.naar_comp(xbyte)/16384, 2), 'y': round(self.naar_comp(ybyte)/16384, 2), 'z':round(self.naar_comp(zbyte)/16384, 2)}
        # return f"accelero   :  x: {round(self.naar_comp(xbyte)/16384, 2)} y: {round(self.naar_comp(ybyte)/16384, 2)} z: {round(self.naar_comp(zbyte)/16384, 2)}"
    
    def verwerk_gyr(self, arr):
        xbyte = (arr[0] << 8) | arr[1]
        ybyte = (arr[2] << 8) | arr[3]
        zbyte = (arr[4] << 8) | arr[5]
        return {'x': round(self.naar_comp(xbyte)/131, 2), 'y': round(self.naar_comp(ybyte)/131, 2), 'z':round(self.naar_comp(zbyte)/131, 2)}
        # return f"gyro     :   rot_x: {round(self.naar_comp(xbyte)/131, 2)} rot_y: {round(self.naar_comp(ybyte)/131, 2)} rot_z: {round(self.naar_comp(zbyte)/131, 2)}"
    
    def printer(self,temp, acc, gyr):
        print(f"De temperatuur is {temp}° Celsius")
        print("accelero:   ", end="")
        for i,x in acc.items():
            print(f"{i}: {x} ", end="")
        print("\ngyro    : ", end="")
        for y,z in gyr.items():
            print(f"rot_{y}: {z} ", end="")
        pass

    def close(self):
        self.i2c.close()