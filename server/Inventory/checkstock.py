import psycopg2 as postgre


class Stock:
    
    def __init__(self) -> None:
        pass

    def connect(self):
        self.con = postgre.connect(database="iftqwlwu",user="iftqwlwu",host="satao.db.elephantsql.com",port="5432",password="sKxhxsNLIblOuhLGBPEiy7O4iXhF1nsP")
        self.cur = self.con.cursor()
    
    def getStock(self, query):
        try:
            self.cur.execute(query)
            rows = self.cur.fetchone()
            self.cur.close()
            self.con.close()
            data = rows[0]
            return data
        except Exception as e:
            return "error"