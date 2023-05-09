import psycopg2 as postgre
from sqlalchemy import create_engine
import urllib
import pandas as pd


class AddProduct:

    def __init__(self) -> None:
        pass


    def connect(self):
        try:
            self.con = postgre.connect(database="iftqwlwu",user="iftqwlwu",host="satao.db.elephantsql.com",port="5432",password="sKxhxsNLIblOuhLGBPEiy7O4iXhF1nsP")
            self.cur = self.con.cursor()
            self.uri = "postgresql+psycopg2://iftqwlwu:" + urllib.parse.quote('sKxhxsNLIblOuhLGBPEiy7O4iXhF1nsP') + "@satao.db.elephantsql.com:5432/iftqwlwu"
            self.engine = create_engine(self.uri)
            return True
        except Exception as e:
            return False

    def store(self, table, df):
        try:
            df.to_sql(name=table, con=self.engine,if_exists='replace',index=False,index_label='sku')
            return True
        except Exception as e:
            return False

    def close(self):
        self.cur.close()
        self.con.close()