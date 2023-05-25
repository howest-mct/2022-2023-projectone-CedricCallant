from .Database import Database


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

