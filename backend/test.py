import serial 
ser = serial.Serial('/dev/serial0', baudrate=9600, timeout=1)  # open serial port 
print(ser.name) 
ser.flush()        # check which port was really used 
tekst = "test"
te_versturen_tekst = tekst.encode(encoding='utf-8')
ser.write(te_versturen_tekst)     # write a string 
ack_send = False
try:
    while True:
        if ack_send:
            ser.write(te_versturen_tekst)

        line = ser.readline()
        print(line)
        if line == '':
            pass
        elif line[0:4] == 'lamp':
            print(f'lamp is now {line[6]}')
        elif line[0:10] == 'msgcolor':
            print(f'This message has te color {line[11:len(line)]}')
        elif line[0:3] == 'msg':
            print(f'Esp32 says: {line[5:len(line)]}')
        elif line[0:4] == 'idle':
            print(f'idle mode set to {line[6:len(line)]}')
        elif line[0:5] == 'color':
            print(f'color is set to {line[6:len(line)]}')
except KeyboardInterrupt as k:
    print(k)
finally:
    ser.close()   