import serial 
ser = serial.Serial('/dev/serial0', baudrate=9600, timeout=1)  # open serial port 
print(ser.name) 
ser.flush()        # check which port was really used 
tekst = "test"
te_versturen_tekst = tekst.encode(encoding='utf-8')
ser.write(te_versturen_tekst)     # write a string 
try:
    while True:
        print('huh')
        line = ser.readline()
        print(line)
except KeyboardInterrupt as k:
    print(k)
finally:
    ser.close()   