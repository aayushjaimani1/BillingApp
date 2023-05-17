import json
import psycopg2 as postgre
import jwt
from flask import jsonify, redirect
from instamojo_wrapper import Instamojo

class Payment:

    def __init__(self) -> None:
        pass

    def connect(self):
        self.con = postgre.connect(database="iftqwlwu",user="iftqwlwu",host="satao.db.elephantsql.com",port="5432",password="sKxhxsNLIblOuhLGBPEiy7O4iXhF1nsP")
        self.cur = self.con.cursor()

    def getPaymentDetails(self, decoded):
        self.details = []
        try:
            self.cur.execute("SELECT payment_instamojo, payment_api_key, payment_auth_token, payment_private_salt, payment_client_id, payment_client_secret, username FROM users WHERE username = %s AND user_password = %s",(decoded['username'], decoded['password']))
            rows = self.cur.fetchall()
            for row in rows:
                item = {
                    'payment_instamojo': row[0],
                    'payment_api_key': row[1],
                    'payment_auth_token': row[2],
                    'payment_private_salt': row[3],
                    'payment_client_id': row[4],
                    'payment_client_secret': row[5],
                    'username': row[6]
                }
                self.details.append(item)

        except Exception as e:
            return "User Not Found"
        
    def pay(self, name, email, amount, data):
        purpose = "Payment to " + self.details[0]['username']
        API_KEY = self.details[0]['payment_api_key']
        AUTH_TOKEN = self.details[0]['payment_auth_token']
        url_to_redirect = "http://127.0.0.1:5000/paymentStatus?payload="+data
        api = Instamojo(api_key=API_KEY, auth_token=AUTH_TOKEN, endpoint='https://test.instamojo.com/api/1.1/')
        response = api.payment_request_create(
            amount=amount,
            purpose=purpose,
            send_email=True,
            email=email,
            buyer_name=name,
            redirect_url= url_to_redirect
            )
        return response['payment_request']['longurl']
    

    def addCustomer(self, username, password, customerInfo):
        if self.generateTable(username, password):
            query = "INSERT INTO "+ self.table + "(fname, lname, address, email, phone) VALUES('"+ customerInfo['fname'] + "', '" + customerInfo['lname'] + "', '" + customerInfo['address'] + "', '" + customerInfo['email'] + "', '" + customerInfo['phone'] + "')"
            self.cur.execute(query)
            self.con.commit()
            self.cur.execute("SELECT customer_id FROM "+ self.table + " WHERE fname = '" + customerInfo['fname'] + "' AND email = '" + customerInfo['email'] + "'")
            row = self.cur.fetchone()
            return row[0]

    
    def generateTable(self, username, password):
        self.cur.execute("SELECT gst_number FROM users WHERE username = %s AND user_password = %s",(username, password))
        rows = self.cur.fetchone()
        self.table = "customer_" + str(rows[0])
        self.cur.execute("SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '"+self.table+"')")
        rows = self.cur.fetchall()
        if rows[0][0] != False :
            return True
        else:
            self.cur.execute("CREATE TABLE "+ self.table +" (customer_id SERIAL PRIMARY KEY NOT NULL, fname text, lname text, address text, email text, phone text)")
            self.con.commit()
            return True

    def addInvoice(self, username, password, customer_id, cart, branch, summary):
        if self.generateInvoiceTable(username, password):
            query = "INSERT INTO "+ self.table + "(customer_id, cart, summary) VALUES('"+ str(customer_id) + "', '" + json.dumps(cart) + "', '"+ json.dumps(summary) +"')"
            self.cur.execute(query)
            self.con.commit()
            return self.manageStock(cart, branch, username, password)

    def generateInvoiceTable(self, username, password):
        self.cur.execute("SELECT gst_number FROM users WHERE username = %s AND user_password = %s",(username, password))
        rows = self.cur.fetchone()
        self.table = "invoice_" + str(rows[0])
        self.cur.execute("SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '"+self.table+"')")
        rows = self.cur.fetchall()
        if rows[0][0] != False :
            return True
        else:
            self.cur.execute("CREATE TABLE "+ self.table +" (purchase_id SERIAL PRIMARY KEY NOT NULL, date DATE DEFAULT CURRENT_DATE, time TIME DEFAULT CURRENT_TIME, customer_id text, cart json, summary json)")
            self.con.commit()
            return True
        
    def manageStock(self, cart, branch, username, password):
        self.cur.execute("SELECT gst_number FROM users WHERE username = %s AND user_password = %s",(username, password))
        rows = self.cur.fetchone()
        self.table = branch+"_" + str(rows[0])
        for i in range(0,len(cart)):
            query = "UPDATE "+ self.table +" SET stock = stock - " + str(cart[i]['quantity']) + " WHERE sku = '"+ cart[i]['id'] +"'"
            print(query)
            self.cur.execute(query)
            self.con.commit()
        return "success"

    def close(self):
        self.cur.close()
        self.con.close()