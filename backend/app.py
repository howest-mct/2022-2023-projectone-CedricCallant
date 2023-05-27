import threading
import time
from repositories.DataRepository import DataRepository
from flask import Flask, jsonify, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from helpers.simpleRfid import SimpleMFRC522
from helpers.Ledstrip_Class import Ledstrip
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

cubeid = 180129144013

# TODO: GPIO
reader = SimpleMFRC522() #RFID reader object


leds = Ledstrip() #Ledstrip class
led_mode= 'static'
led_prev_mode = 'static'
led_color = (111, 0, 255)

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
    elif led_mode == 'sound':
        pass


app = Flask(__name__)
app.config['SECRET_KEY'] = 'HELLOTHISISSCERET'

# ping interval forces rapid B2F communication
socketio = SocketIO(app, cors_allowed_origins="*",
                    async_mode='gevent', ping_interval=0.5)
CORS(app)

# START een thread op. Belangrijk!!! Debugging moet UIT staan op start van de server, anders start de thread dubbel op
# werk enkel met de packages gevent en gevent-websocket.
def all_out():
    # wait 10s with sleep sintead of threading.Timer, so we can use daemon
    time.sleep(10)
    while True:
        set_led_mode()


def start_thread():
    # threading.Timer(10, all_out).start()
    t = threading.Thread(target=all_out, daemon=True)
    t.start()
    print("thread started")


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


# SOCKET IO
@socketio.on('connect')
def initial_connection():
    print('A new client connect')

@socketio.on('F2B_read_tag')
def read_tag(jsonObject):
    print('Reading the tag...')
    id,text = reader.read()
    if int(id) == int(jsonObject['id']):
        emit('B2F_login_succes', {'cubeid': id})
    else:
        emit('B2F_login_failed', {'error': 'Username and id do not match tag id, please try the right tag or a different username'})

@socketio.on('F2B_change_idle_mode')
def change_mode(jsonObject):
    global led_mode
    led_mode = jsonObject['new_mode']


if __name__ == '__main__':
    try:
        start_thread()
        print("**** Starting APP ****")
        socketio.run(app, debug=False, host='0.0.0.0')
    except KeyboardInterrupt:
        print('KeyboardInterrupt exception is caught')
    finally:
        leds.clear_leds()
        print("finished")
