import serial 
import time
ser = serial.Serial('/dev/ttyUSB0', baudrate=9600, timeout=1)  # open serial port 
print(ser.name) 
ser.flush()        # check which port was really used 
tekst = "da:leds (255,0,0)"
to_send = tekst.encode("utf-8")
ser.write(to_send)
# ack_send = False
try:
    while True:
        # if ack_send:
        #     ser.write(te_versturen_tekst)

        # line = ser.readline()
        # print(line)
        # if line == '':
        #     pass
        # elif line[0:4] == 'lamp':
        #     print(f'lamp is now {line[6]}')
        # elif line[0:10] == 'msgcolor':
        #     print(f'This message has te color {line[11:len(line)]}')
        # elif line[0:3] == 'msg':
        #     print(f'Esp32 says: {line[5:len(line)]}')
        # elif line[0:4] == 'idle':
        #     print(f'idle mode set to {line[6:len(line)]}')
        # elif line[0:5] == 'color':
        #     print(f'color is set to {line[6:len(line)]}')
        line = ser.readline()
        print(line)
        time.sleep(1)
except KeyboardInterrupt as k:
    print(k)
finally:
    ser.close()   