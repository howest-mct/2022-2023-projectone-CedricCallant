import threading
import time
from datetime import datetime
from repositories.DataRepository import DataRepository
from flask import Flask, jsonify, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from RPi import GPIO
from helpers.simpleRfid import SimpleMFRC522Custom
from helpers.Ledstrip_Class import Ledstrip
from helpers.MPU_class import Mpu6050
from helpers.MCP_class import Mcp
import serial
import json
import urllib
import requests

url = 'https://parseapi.back4app.com/classes/Color?limit=1000&order=name&keys=name,hexCode,redDecimal,greenDecimal,blueDecimal'
headers = {
    'X-Parse-Application-Id': 'vei5uu7QWv5PsN3vS33pfc7MPeOPeZkrOcP24yNX', # This is the fake app's application id
    'X-Parse-Master-Key': 'aImLE6lX86EFpea2nDjq9123qJnG0hxke416U7Je' # This is the fake app's readonly master key
}
help = json.loads(requests.get(url, headers=headers).content.decode('utf-8')) # Here you have the data that you need
color_json = json.dumps(help, indent=2)

def hex_to_dec(value):
    h = value[1:7]
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))


ser = serial.Serial('/dev/ttyUSB0', baudrate=9600, timeout=1)  # open serial port 
print(ser.name)       # check which port was really used 
stop_polling = 0

# print(color_json)

def rgb_to_hex(r, g, b):
    return '#{:02x}{:02x}{:02x}'.format(r, g, b)

def get_idle_mode(help):
    if help['ActieId'] == 1:
        return True
    elif help['ActieId'] == 8:
        return False

cubeid = '29F0889C'
sound_detection = 21
idle_mode = get_idle_mode(DataRepository.get_last_idle_state(1,8,12))
last_known_event = DataRepository.get_last_events(cubeid)

# TODO: GPIO
reader = SimpleMFRC522Custom() #RFID reader object
accelero = Mpu6050(0x68)
GPIO.setmode(GPIO.BCM)
GPIO.setup(sound_detection, GPIO.IN)



leds = Ledstrip() #Ledstrip class
leds_on = True
led_mode= 'static'
led_prev_mode = 'static'
led_color = hex_to_dec(DataRepository.get_last_used_color(4,12)['Value'])
lamp = False


def set_led_mode():
    global led_mode
    global led_prev_mode
    if led_mode == 'static':
        leds.set_Brightness(1)
        leds.static(led_color)
        if led_mode != led_prev_mode:
            led_prev_mode = led_mode
            return DataRepository.add_to_history(12,6)
    elif led_mode == 'pulse':
        leds.pulse(led_color)
        if led_mode != led_prev_mode:
            led_prev_mode = led_mode
            return DataRepository.add_to_history(12,5)
    elif led_mode == 'wave':
        leds.set_Brightness(1)
        leds.wave(led_color)
        if led_mode != led_prev_mode:
            led_prev_mode = led_mode
            return DataRepository.add_to_history(12,7)


app = Flask(__name__)
app.config['SECRET_KEY'] = 'HELLOTHISISSCERET'

# ping interval forces rapid B2F communication
socketio = SocketIO(app, cors_allowed_origins="*",
                    async_mode='gevent', ping_interval=0.5)
CORS(app)

# START een thread op. Belangrijk!!! Debugging moet UIT staan op start van de server, anders start de thread dubbel op
# werk enkel met de packages gevent en gevent-websocket.
def all_out():
    global lamp
    global leds_on
    timer = time.time()
    # wait 10s with sleep sintead of threading.Timer, so we can use daemon
    time.sleep(10)
    # moment = time.time()
    while True:
        try:
            acc_state = accelero.read_data()['acc']
            if (acc_state['x'] > 1 or acc_state['x'] < -1) or (acc_state['y'] > 1 or acc_state['y'] < -1):
                if time.time() >= timer + 3:
                    print('movement detected')
                    DataRepository.add_to_history(11,11, acc_state['x'])
                    lamp = not lamp
                    print('lamp state changed')
                    if lamp:
                        DataRepository.add_to_history(12,9)
                    else:
                        DataRepository.add_to_history(12,10)
                    timer = time.time()
        except:
            print('poeperror')
        if GPIO.input(sound_detection):
            print('clap detected')
            leds_on = not leds_on
            if leds_on:
                    DataRepository.add_to_history(12,1)
            else:
                DataRepository.add_to_history(12,8)
            print('led state changed')
        # if time.time() >= moment + 60:
        #     events = DataRepository.get_last_events(cubeid)
        #     socketio.emit('B2F_ack_change', {'changes': events})
        #     moment = time.time()

def led_thread():
    time.sleep(11)
    while True:
        if not lamp:
            if leds_on:
                set_led_mode()
            else:
                leds.clear_leds()
        else:
            leds.white_light('warm')

# lock = threading.Lock()
def esp_thread():
    global ser
    global stop_polling
    r = None
    g = None
    b = None
    rc = DataRepository.get_last_used_color(4,16)
    print(rc['Value'])
    ser.write(f'da:leds {hex_to_dec(rc["Value"])}\n'.encode())
    muc = DataRepository.get_most_used_colors(16)
    for c in muc:
        ser.write(f"da:muc {hex_to_dec(c['value'])}\n".encode())
    # time.sleep(9)
    while True:
        
        if(not stop_polling):
            info = ser.readline().decode()
            # print(info)
            if info == "":
                pass
            elif info[0:3] == 'mpu':
                print('ESP MPU detected, adding to db')
                DataRepository.add_to_history(15,11,float(info[4:len(info)-2]))
            elif info[0:len(info)-2] == 'clap detected':
                print('ESP KY clap detected, adding to db')
                DataRepository.add_to_history(18,12)
            elif info[0:4] == 'tled':
                if info[5] == '1':
                    print('ESP LEDS turned ON, adding to db')
                    DataRepository.add_to_history(16,1)
                elif info[5] == '0':
                    print('ESP LEDS turned OFF, adding to db')
                    DataRepository.add_to_history(16,8)
            elif info[0:4] == 'lamp':
                if info[5] == '1':
                    print('ESP LAMP turned ON, adding to db')
                    DataRepository.add_to_history(16,9)
                elif info[5] == '0':
                    print('ESP LAMP turned OFF, adding to db')
                    DataRepository.add_to_history(16,10)
            elif info[0:2] == 'nc':
                if info[3] == 'r':
                    r=info[4:len(info)-2]
                elif info[3] == 'g':
                    g=info[4:len(info)-2]
                elif info[3] == 'b':
                    b=info[4:len(info)-2]
                    if (r!=None) and (g!=None) and (b!=None):
                        print('ESP LEDS changed color, adding to db')
                        DataRepository.add_to_history(16,4,rgb_to_hex(int(r),int(g),int(b)).upper())
                        socketio.emit('B2F_curr_color', {'hex': DataRepository.get_last_used_color(4,16)['Value']})
            elif info[0:5] == 'msgt':
                pass
            elif info[0:5] == 'msgc':
                pass

def start_thread():
    # threading.Timer(10, all_out).start()
    t = threading.Thread(target=all_out, daemon=True)
    l = threading.Thread(target=led_thread, daemon=True)
    e = threading.Thread(target=esp_thread, daemon=True)
    l.start()
    t.start()
    e.start()
    print("threads started")

# API ENDPOINTS
@app.route('/')
def hallo():
    return "Server is running, er zijn momenteel geen API endpoints beschikbaar."

@app.route('/login/', methods = ['POST'])
def login():
    if request.method == 'POST':
        input = DataRepository.json_or_formdata(request)
        data = DataRepository.read_cube_with_name(input['username'])
        if data is not None:
            return jsonify(data), 200
        else:
            return jsonify(error='Username niet gevonden'), 404
        
@app.route('/color/')
def get_colors():
    return color_json, 200

@app.route('/chats/')
def get_chats():
    data = DataRepository.get_messages()
    if data is not None:
        return jsonify(chats = data), 200
    else:
        return jsonify(error = 'De chats zijn niet beschikbaar')

@app.route('/history/small/<id>/')
def get_small_history(id):
    data = DataRepository.get_last_events(id)
    if data is not None:
        if len(data) == 2:
            return jsonify(data), 200
        else:
            return jsonify(error = 'CubeId niet gevonden'), 404
    else:
        return jsonify(error = 'Kon data niet ophalen :('), 500

# SOCKET IO
@socketio.on('connect')
def initial_connection():
    print('A new client connect')
    emit('B2F_curr_color', {'hex': DataRepository.get_last_used_color(4,12)['Value']})
    emit('B2F_toggled', {'mode': idle_mode})

@socketio.on('F2B_get_loadout')
def initialise_baseinfo(jsonObject):
    if jsonObject['id'] == cubeid:
        emit('B2F_curr_color', {'hex': DataRepository.get_last_used_color(4,12)['Value']})
        emit('B2F_toggled', {'mode': idle_mode})
    else:
        emit('B2F_curr_color', {'hex': DataRepository.get_last_used_color(4,16)['Value']})
        # emit('B2F_toggled', {'mode': idle_mode})

@socketio.on('F2B_read_tag') #Make sure the Serial.println on line 148 is disabled in the esp32 code 
def read_tag(jsonObject):
    global stop_polling
    global cubeid
    print(jsonObject)
    if jsonObject['id'] == cubeid:
        print('Reading the tag...')
        id = reader.read_id()
        if id == jsonObject['id']:
            emit('B2F_login_succes', {'cubeid': id})
        else:
            emit('B2F_login_failed', {'error': 'Username and id do not match tag id, please try the right tag or a different username'})
    else:
        stop_polling = 1
        ser.write('da:rfid'.encode())
        ser.timeout = 5
        auth = ser.readline().decode()
        print(auth)
        print(auth[0:len(auth)-2])
        print(jsonObject['id'])
        stop_polling = 0
        if auth[0:len(auth)-2] == jsonObject['id']:
            ser.timeout = 1
            emit('B2F_login_succes', {'cubeid': jsonObject['id']})
        else:
            ser.timeout = 1
            emit('B2F_login_failed', {'error': 'Username and id do not match tag id, please try the right tag or a different username'})

@socketio.on('F2B_change_idle_mode')
def change_mode(jsonObject):
    global ser
    global led_mode
    global stop_polling
    print(jsonObject)
    if jsonObject['id'] == cubeid:
        led_mode = jsonObject['new_mode']
    else:
        stop_polling = 1
        ser.write(("da:idle " + jsonObject['new_mode']).encode())
        stop_polling = 0

@socketio.on('F2B_change_color')
def change_color(jsonObject):
    global led_color
    global stop_polling
    print(jsonObject)
    if jsonObject['id'] == cubeid:
        led_color = hex_to_dec(jsonObject['hexCode'])
        DataRepository.add_to_history(12,4,jsonObject['hexCode'])
    else:
        stop_polling = 1
        ser.write(f"da:leds {hex_to_dec(jsonObject['hexCode'])}".encode())
        DataRepository.add_to_history(16,4,jsonObject['hexCode'])
        stop_polling = 0
    print(f'Color {jsonObject["hexCode"]} added to database')

@socketio.on('F2B_toggle_idle')
def toggle_idle(jsonObject):
    global leds_on
    global stop_polling
    if jsonObject['id'] == cubeid:
        if jsonObject['state'] == 'Turn OFF':
            leds_on = False
            help_mode = False
            DataRepository.add_to_history(12,8)
            print('Leds turned OFF')
        elif jsonObject['state'] == 'Turn ON':
            leds_on = True
            help_mode = True
            DataRepository.add_to_history(12,1) 
            print('Leds turned ON')
    else:
        if jsonObject['state'] == 'Turn OFF':
            help_mode = False
            ser.write("da:tled 0".encode())
            DataRepository.add_to_history(16,8)
        elif jsonObject['state'] == 'Turn ON':
            help_mode = True
            ser.write("da:tled 1".encode())
            DataRepository.add_to_history(16,1)
    emit('B2F_toggled', {'mode': help_mode})

@socketio.on('F2B_send_message')
def receive_msg(jsonObject):
    print(f"{jsonObject['id']} says {jsonObject['msg']} in color: {jsonObject['color']}")
    time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    if jsonObject['id'] == cubeid:
        data = DataRepository.write_message(time,jsonObject['id'], 'E34F0FE7',jsonObject['color'], jsonObject['msg'])
    else:
        data = DataRepository.write_message(time,jsonObject['id'], cubeid,jsonObject['color'], jsonObject['msg'])
    if data != None:
        socketio.emit('B2F_new_message', {'msg': jsonObject, 'time': time})
    else:
        emit('B2F_message_error', {'error': 'Something went wrong when sending the message'})


if __name__ == '__main__':
    try:
        start_thread()
        print("**** Starting APP ****")
        socketio.run(app, debug=False, host='0.0.0.0')
    except KeyboardInterrupt:
        print('KeyboardInterrupt exception is caught')
    finally:
        leds.clear_leds()
        ser.close()
        print("finished")
