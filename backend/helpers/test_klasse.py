import serial, time, sys, threading
from colorama import Fore, Style, init as colorama_init

colorama_init()

# lock to serialize console output
lock = threading.Lock()

class Highlight:
  def __init__(self, clazz, color):
    self.color = color
    self.clazz = clazz
  def __enter__(self):
    print(self.color, end="")
  def __exit__(self, type, value, traceback):
    if self.clazz == Fore:
      print(Fore.RESET, end="")
    else:
      assert self.clazz == Style
      print(Style.RESET_ALL, end="")
    sys.stdout.flush()

if len(sys.argv) != 3 and len(sys.argv) != 4:
  sys.stderr.write("Usage: %s 9600 <port1> [<port2>]\n" % (sys.argv[0]))
  exit(1)

def read_serial(port, baud, color):
  ser = serial.Serial()
  ser.port = port

  ser.baudrate = baud
  ser.bytesize = serial.EIGHTBITS #number of bits per bytes
  ser.parity = serial.PARITY_NONE #set parity check: no parity
  ser.stopbits = serial.STOPBITS_ONE #number of stop bits
  #ser.timeout = None          #block read
  ser.timeout = 0            # non blocking read
  ser.xonxoff = False     #disable software flow control
  ser.rtscts = False     #disable hardware (RTS/CTS) flow control
  ser.dsrdtr = False       #disable hardware (DSR/DTR) flow control
  ser.writeTimeout = 2     #timeout for write

  try:
    ser.open()
  except Exception as e:
    print("error open serial port: " + str(e))
    exit()

  if ser.isOpen():
    try:
        while True:
            c = ser.read(size=1024)
            with lock:
              if len(c) > 0:
                print(color)
                sys.stdout.buffer.write(c)

        ser.close()

    except Exception as e1:
        print ("error communicating...: " + str(e1))

  else:
    print("cannot open serial port ")
    exit()

# Create two threads as follows
try:
   t = threading.Thread(target=read_serial, args=(sys.argv[2], sys.argv[1], Fore.GREEN ))
   t.daemon = True  # thread dies when main thread (only non-daemon thread) exits.
   t.start()

   if len(sys.argv) == 4:
      t = threading.Thread(target=read_serial, args=(sys.argv[3], sys.argv[1], Fore.RED ))
      t.daemon = True  # thread dies when main thread (only non-daemon thread) exits.
      t.start()
except:
   print("Error: unable to start thread")

try:
   while True:
      pass
except KeyboardInterrupt:
   exit()