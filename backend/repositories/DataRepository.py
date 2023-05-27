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

