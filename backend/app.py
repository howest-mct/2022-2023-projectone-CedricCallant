import threading
import time
from repositories.DataRepository import DataRepository
from flask import Flask, jsonify, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from helpers.simpleRfid import SimpleMFRC522

# TODO: GPIO
reader = SimpleMFRC522()

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
        print('*** We zetten alles uit **')

        # save our last run time
        # last_time_alles_uit = now
        time.sleep(30)


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


if __name__ == '__main__':
    try:
        start_thread()
        print("**** Starting APP ****")
        socketio.run(app, debug=False, host='0.0.0.0')
    except KeyboardInterrupt:
        print('KeyboardInterrupt exception is caught')
    finally:
        print("finished")
