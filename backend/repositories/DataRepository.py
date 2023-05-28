from .Database import Database
from datetime import datetime


class DataRepository:
    @staticmethod
    def json_or_formdata(request):
        if request.method != 'GET' and request.content_type == 'application/json':
            gegevens = request.get_json()
        else:
            gegevens = request.form.to_dict()
        return gegevens

    @staticmethod
    def read_cube_with_name(username):
        sql = 'SELECT * FROM Cube WHERE BINARY Username = %s'
        params = [username]
        return Database.get_one_row(sql,params)
    
    def add_to_history(CubeDeviceId,ActionId,value = None):
        sql = 'INSERT INTO History(Time, CubeDeviceId, ActieId,Value) VALUES(%s,%s,%s,%s)'
        time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        params = [time, CubeDeviceId, ActionId, value]
        return Database.execute_sql(sql, params)
    
    def get_last_used_color(actionid, cubedeviceid):
        sql = 'SELECT * FROM History WHERE ActieId = %s AND CubeDeviceId = %s ORDER BY Time DESC LIMIT 1'
        params = [actionid,cubedeviceid]
        return Database.get_one_row(sql,params)
    
    def get_last_idle_state(action_on, action_off, cubedeviceid):
        sql = 'SELECT * FROM History WHERE (ActieId = %s OR ActieId = %s) and CubeDeviceId = %s order by time desc limit 1'
        params = [action_on,action_off,cubedeviceid]
        return Database.get_one_row(sql,params)


