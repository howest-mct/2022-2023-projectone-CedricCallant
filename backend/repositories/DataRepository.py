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

    def get_last_events(cubeid):
        sql = f'SELECT h.Time, d.Type, concat(h.value, " ", if(d.measureunit is null, "",d.measureunit)) as `Value`, a.Description FROM History h JOIN CubeDevice cd ON h.CubeDeviceId = cd.CubeDeviceId join Device d ON cd.DeviceId = d.DeviceId join Cube c ON cd.CubeId = c.CubeId join Action a on h.ActieId = a.ActionId Where c.CubeId = %s order by h.time desc limit 2'
        params = [cubeid]
        return Database.get_rows(sql,params)
    
    def get_all_colors():
        sql = 'SELECT * FROM Color'
        return Database.get_rows(sql)
    
    def get_most_used_colors(cubedevice):
        sql = 'SELECT value, count(*) as `times used` fROM History where CubeDeviceId = %s and value is not NULL group by value order by `times used` desc limit 10'
        params = [cubedevice]
        return Database.get_rows(sql, params)
    
    def get_messages():
        sql = 'SELECT * FROM ChatMessage'
        return Database.get_rows(sql)
    
    def write_message(time, senderid, receiverid, hexcode, message):
        sql = 'insert into ChatMessage (Tijdstip, SenderCubeId, ReceiverCubeId, HexCode,Message) VALUES (%s,%s,%s, %s, %s)'
        params = [time, senderid, receiverid, hexcode, message]
        return Database.execute_sql(sql, params)

    def get_recent_messages():
        sql = "SELECT ChatHistoryId, DATE_FORMAT(Tijdstip,'%Y-%m-%d %H:%i:%S') as `Tijdstip`, SenderCubeId, ReceiverCubeId, Hexcode, Message FROM ChatMessage ORDER BY `Tijdstip` desc LIMIT 2"
        return Database.get_rows(sql)
    
    def get_message_amount():
        sql = "SELECT DATE_FORMAT(Tijdstip,'%Y-%m-%d %H:%i:%S') as `Tijdstip` , SenderCubeID, count(*) as `totaal` FROM ChatMessage WHERE Tijdstip > now() - interval 6 day GROUP BY date(Tijdstip), SenderCubeId order by date(`Tijdstip`) asc, SenderCubeId asc;"
        return Database.get_rows(sql)
