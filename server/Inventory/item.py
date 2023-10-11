from flask.json import jsonify
import psycopg2 as postgre


class Item:
    
    def __init__(self) -> None:
        pass

    def connect(self):
        self.con = postgre.connect(database="iftqwlwu",user="iftqwlwu",host="satao.db.elephantsql.com",port="5432",password="sKxhxsNLIblOuhLGBPEiy7O4iXhF1nsP")
        self.cur = self.con.cursor()
    
    def getProduct(self, query):
        try:
            self.cur.execute(query)
            rows = self.cur.fetchall()
            self.cur.close()
            self.con.close()
            data = [{'id': row[1], 'name': row[0], 'amt': row[3]} for row in rows]
            return data
        except Exception as e:
            return "error"