import json
import psycopg2 as postgre
import jwt
from flask import jsonify, redirect
from instamojo_wrapper import Instamojo

class Invoice:

    def __init__(self) -> None:
        pass

    def connect(self):
        self.con = postgre.connect(database="iftqwlwu",user="iftqwlwu",host="satao.db.elephantsql.com",port="5432",password="sKxhxsNLIblOuhLGBPEiy7O4iXhF1nsP")
        self.cur = self.con.cursor()

    def getInvoices(self,username,password):
        self.cur.execute("SELECT gst_number FROM users WHERE username = %s AND user_password = %s",(username, password))
        rows = self.cur.fetchone()
        self.table = "invoice_" + str(rows[0])
        self.table2 = "customer_" + str(rows[0])

        self.cur.execute("SELECT * FROM "+ self.table)
        rows = self.cur.fetchall()
        items = []
        for row in rows:
            self.cur.execute("SELECT fname, lname FROM "+ self.table2 + " WHERE customer_id = '" + row[3] + "'")
            name = self.cur.fetchone()
            item = {
                'purchase_id': row[0],
                'date': row[1].isoformat(),
                'time': row[2].strftime('%H:%M:%S'),
                'customer_name': name[0] + " " + name[1]
            }
            items.append(item)
        return items
    
    def getFullInvoices(self,username,password,id):
        self.cur.execute("SELECT gst_number FROM users WHERE username = %s AND user_password = %s",(username, password))
        rows = self.cur.fetchone()
        self.table = "invoice_" + str(rows[0])
        self.table2 = "customer_" + str(rows[0])

        self.cur.execute("SELECT * FROM "+ self.table + " WHERE purchase_id='"+ id +"'")
        rows = self.cur.fetchall()
        print(rows)
        items = []
        for row in rows:
            self.cur.execute("SELECT * FROM "+ self.table2 + " WHERE customer_id = '" + row[3] + "'")
            name = self.cur.fetchone()
            customer = {
                'customer_id': name[0],
                'fname': name[1],
                'lname': name[2],
                'address': name[3],
                'email': name[4],
                'phone': name[5]
            }
            item = {
                'purchase_id': row[0],
                'date': row[1].isoformat(),
                'time': row[2].strftime('%H:%M:%S'),
                'customer_details': customer,
                'cart': row[4],
                'summary': row[5]

            }
            items.append(item)
        return items

    def getSalesData(self,username,password):
        self.cur.execute("SELECT gst_number FROM users WHERE username = %s AND user_password = %s",(username, password))
        rows = self.cur.fetchone()
        self.table = "invoice_" + str(rows[0])
        self.cur.execute("SELECT * FROM "+ self.table + " WHERE date >= CURRENT_DATE - INTERVAL '1 month' AND date <= CURRENT_DATE")
        rows = self.cur.fetchall()
        sales = []
        for row in rows:
            sale = [row[1].isoformat(),row[5]['total']]
            sales.append(sale)
        return sales
    
    def getDailySalesData(self,username,password):
        self.cur.execute("SELECT gst_number FROM users WHERE username = %s AND user_password = %s",(username, password))
        rows = self.cur.fetchone()
        self.table = "invoice_" + str(rows[0])
        self.cur.execute("SELECT * FROM "+ self.table + " WHERE date = CURRENT_DATE")
        rows = self.cur.fetchall()
        sales = []
        for row in rows:
            sale = [row[2].strftime('%H:%M:%S'),row[5]['total']]
            sales.append(sale)
        return sales
    
    def getYearlySalesData(self,username,password):
        self.cur.execute("SELECT gst_number FROM users WHERE username = %s AND user_password = %s",(username, password))
        rows = self.cur.fetchone()
        self.table = "invoice_" + str(rows[0])
        self.cur.execute("SELECT * FROM "+ self.table + " WHERE date >= CURRENT_DATE - INTERVAL '1 year' AND date <= CURRENT_DATE")
        rows = self.cur.fetchall()
        sales = []
        for row in rows:
            sale = [row[1].strftime("%B"),row[5]['total']]
            sales.append(sale)
        return sales

    def close(self):
        self.cur.close()
        self.con.close()