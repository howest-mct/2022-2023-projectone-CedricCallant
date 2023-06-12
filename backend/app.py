import threading
import time
from datetime import datetime
from subprocess import check_output
from repositories.DataRepository import DataRepository
from flask import Flask, jsonify, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from RPi import GPIO
from helpers.simpleRfid import SimpleMFRC522Custom
from helpers.Ledstrip_Class import Ledstrip
from helpers.MPU_class import Mpu6050
from helpers.i2c_lcd import *
import serial


def hex_to_dec(value):
    h = value[1:7]
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))


ser = serial.Serial('/dev/ttyUSB0', baudrate=9600, timeout=1)  # open serial port 
print(ser.name)       # check which port was really used 
stop_polling = 0


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
scanned_id = ''
readrfid = False

# TODO: GPIO
reader = SimpleMFRC522Custom() #RFID reader object
accelero = Mpu6050(0x68)
GPIO.setmode(GPIO.BCM)
GPIO.setup(sound_detection, GPIO.IN)

started = 0

lcd = lcd()


leds = Ledstrip() #Ledstrip class
leds_on = True
led_mode= 'static'
led_prev_mode = 'static'
led_color = hex_to_dec(DataRepository.get_last_used_color(4,12)['Value'])
lamp = False

messages = []
display_msg_color = False
message_received = False


def set_led_mode(led_mode = led_mode):
    global led_prev_mode
    if led_mode == 'static':
        leds.set_Brightness(1)
        leds.static(led_color)
        if led_mode != led_prev_mode:
            led_prev_mode = led_mode
            print('ledmode set to static')
            return DataRepository.add_to_history(12,6)
    elif led_mode == 'pulse':
        leds.pulse(led_color)
        if led_mode != led_prev_mode:
            led_prev_mode = led_mode
            print('ledmode set to pulse')
            return DataRepository.add_to_history(12,5)
    elif led_mode == 'wave':
        leds.set_Brightness(1)
        leds.wave(led_color)
        if led_mode != led_prev_mode:
            led_prev_mode = led_mode
            print('ledmode set to wave')
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
    global message_received
    global messages
    global display_msg_color
    global started
    global ip_displayed
    global scanned_id
    timer = time.time()
    # wait 10s with sleep sintead of threading.Timer, so we can use daemon
    time.sleep(10)
    # moment = time.time()
    started =1
    ip_displayed = 0
    while True:
        if not message_received:
            if not ip_displayed:
                ips = str(check_output(['hostname', '--all-ip-addresses']))
                adresses = ips.split(" ")
                lcd.lcd_display_string(adresses[1])
                ip_displayed = 1
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
                pass
            if readrfid:
                scanned_id = reader.read_id()
                print(scanned_id)
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
        else:
            lcd.lcd_clear()
            msg_info = f'You received {len(messages)} messages'
            lcd.lcd_display_string(string=msg_info[0:16])
            lcd.lcd_display_string(msg_info[16:len(msg_info)],2)
            cardid = reader.read_id()
            if cardid == cubeid:
                if len(messages) == 1:
                    lcd.lcd_clear()
                    message_timer = time.time()
                    display_msg_color = True
                    while message_timer + 60 >= time.time():
                        lcd.lcd_display_string(messages[0]['message'][0:16])
                        lcd.lcd_display_string(messages[0]['message'][16:len(messages[0]['message'])], 2)
                    display_msg_color = False
                    lcd.lcd_clear()
                message_received = 0
                ip_displayed = 0

def led_thread():
    global message_received
    global display_msg_color
    global led_mode
    global led_color
    global started
    time.sleep(1)
    while True:
        if not message_received:
            if not lamp:
                if leds_on:
                    set_led_mode()
                else:
                    leds.clear_leds()
            else:
                leds.white_light('warm')
        else:
            if not display_msg_color:
                set_led_mode('pulse')
            else:
                prev_ledcolor = led_color
                led_color = hex_to_dec(messages[0]['color'])
                while display_msg_color:
                    set_led_mode('static')
                led_color = prev_ledcolor

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
    global started
    global ip_displayed
    # threading.Timer(10, all_out).start()
    t = threading.Thread(target=all_out, daemon=True)
    l = threading.Thread(target=led_thread, daemon=True)
    e = threading.Thread(target=esp_thread, daemon=True)
    l.start()
    t.start()
    e.start()
    while not started:
        lcd.lcd_display_string('Starting')
        time.sleep(0.5)
        lcd.lcd_display_string('.', 1,8)
        time.sleep(0.5)
        lcd.lcd_display_string('.', 1,9)
        time.sleep(0.5)
        lcd.lcd_display_string('.', 1,10)
        time.sleep(0.5)
        lcd.lcd_display_string('   ',1,8)
    lcd.lcd_clear()
    ip_displayed = 0
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
    return DataRepository.get_all_colors(), 200

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
    global scanned_id
    global stop_polling
    global cubeid
    global readrfid
    print(jsonObject)
    if jsonObject['id'] == cubeid:
        print('Reading the tag...')
        readrfid = 1
        while scanned_id == '':

            time.sleep(0.1)
        if scanned_id == jsonObject['id']:
            emit('B2F_login_succes', {'cubeid': scanned_id})
            scanned_id = ''
        else:
            emit('B2F_login_failed', {'error': 'Username and id do not match tag id, please try the right tag or a different username'})
    else:
        stop_polling = 1
        ser.write('da:rfid'.encode())
        ser.timeout = 5
        auth = ser.readline().decode()
        print(auth, " ok")
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
        device = 12
    else:
        stop_polling = 1
        ser.write(("da:idle " + jsonObject['new_mode']).encode())
        stop_polling = 0
        device = 16
    DataRepository.add_to_history(device,7,jsonObject['new_mode'])

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
    global message_received
    global stop_polling
    print(jsonObject)
    print(f"{jsonObject['id']} says {jsonObject['msg']} in color: {jsonObject['color']}")
    timer = str(datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    if jsonObject['id'] == cubeid:
        data = DataRepository.write_message(timer,jsonObject['id'], 'E34F0FE7',jsonObject['color'], jsonObject['msg'])
        if data != None:
            socketio.emit('B2F_new_message', {'msg': jsonObject, 'time': timer})
            stop_polling = 1
            ser.write(f"da:msgt {jsonObject['msg']}".encode())
            time.sleep(1)
            ser.write(f"da:msgc {hex_to_dec(jsonObject['color'])}".encode())
            # messages.append({'message': jsonObject['msg'], 'color': jsonObject['color']})
            stop_polling = 0
            
        else:
            emit('B2F_message_error', {'error': 'Something went wrong when sending the message'})
    else:
        data = DataRepository.write_message(timer,jsonObject['id'], cubeid,jsonObject['color'], jsonObject['msg'])
        if data != None:
            socketio.emit('B2F_new_message', {'msg': jsonObject, 'time': timer})
            messages.append({'message': jsonObject['msg'], 'color': jsonObject['color']})
            message_received = True
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
