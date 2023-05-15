from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import jwt
import psycopg2 as postgre
import recommendProduct
import MultipleProduct
import item
import checkstock

app = Flask(__name__)
CORS(app)

@app.route('/addproduct', methods=['POST'])
def add_product():
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        decoded = {}
        try:
            decoded = jwt.decode(token, "123", algorithms=["HS256"])
            
        except Exception as e:
            print(e.args)
            return jsonify('Invalid or expired token.'), 401
        
        file = request.files['excel_file']
        df = pd.read_excel(file)
        required_columns = ['pname', 'sku', 'stock', 'price', 'image', 'category']
        for col in required_columns:
            if col not in df.columns:
                return jsonify('Invalid file format.'), 404
        else:
            con = postgre.connect(database="iftqwlwu",user="iftqwlwu",host="satao.db.elephantsql.com",port="5432",password="sKxhxsNLIblOuhLGBPEiy7O4iXhF1nsP")
            cur = con.cursor()
            cur.execute("SELECT gst_number FROM users WHERE username = %s AND user_password = %s",(decoded['username'], decoded['password']))
            rows = cur.fetchone()
            table = str(request.form['branch']) + "_" + str(rows[0])
            cur.close()
            con.close()
            
            a = MultipleProduct.AddProduct()
            if a.connect():
                if a.store(table,df):
                    a.close()
                    return jsonify("Success")
                else:
                    return jsonify("Not able to store")
            else:
                return jsonify("Connection Error")

        
    else:
        return jsonify('Missing or invalid Authorization header.'), 401
    
@app.route('/delete', methods=['POST'])
def delete_product():
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        decoded = {}
        try:
            decoded = jwt.decode(token, "123", algorithms=["HS256"])
        except Exception as e:
            return jsonify('Invalid or expired token.'), 401
        
        sku = request.form['delete_sku']
        con = postgre.connect(database="iftqwlwu",user="iftqwlwu",host="satao.db.elephantsql.com",port="5432",password="sKxhxsNLIblOuhLGBPEiy7O4iXhF1nsP")
        cur = con.cursor()
        cur.execute("SELECT gst_number FROM users WHERE username = %s AND user_password = %s",(decoded['username'], decoded['password']))
        rows = cur.fetchone()
        table = str(request.form['branch']) + "_" + str(rows[0])
        query = "DELETE FROM "+ table +" WHERE sku = " + sku
        try:
            cur.execute(query)
            con.commit()
        except Exception as e:
            return jsonify("Not able to delete")
        finally:
            cur.close()
            con.close()
        return jsonify("success")
    else:
        return jsonify('Missing or invalid Authorization header.'), 401
    
@app.route('/item', methods=['POST'])
def getItem():
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        decoded = {}
        try:
            decoded = jwt.decode(token, "123", algorithms=["HS256"])
        except Exception as e:
            return jsonify('Invalid or expired token.'), 401
        
        id = request.form['id']
        con = postgre.connect(database="iftqwlwu",user="iftqwlwu",host="satao.db.elephantsql.com",port="5432",password="sKxhxsNLIblOuhLGBPEiy7O4iXhF1nsP")
        cur = con.cursor()
        cur.execute("SELECT gst_number FROM users WHERE username = %s AND user_password = %s",(decoded['username'], decoded['password']))
        rows = cur.fetchone()
        table = str(request.form['branch']) + "_" + str(rows[0])
        query = "SELECT * FROM "+ table +" WHERE sku = " + id
        cur.close()
        con.close()
        i = item.Item()
        i.connect()
        result = i.getProduct(query)
        return jsonify(result)
    else:
        return jsonify('Missing or invalid Authorization header.'), 401
    
@app.route('/checkStock', methods=['POST'])
def checkStock():
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        decoded = {}
        try:
            decoded = jwt.decode(token, "123", algorithms=["HS256"])
        except Exception as e:
            return jsonify('Invalid or expired token.'), 401
        
        id = request.form['id']
        qty = request.form['qty']
        con = postgre.connect(database="iftqwlwu",user="iftqwlwu",host="satao.db.elephantsql.com",port="5432",password="sKxhxsNLIblOuhLGBPEiy7O4iXhF1nsP")
        cur = con.cursor()
        cur.execute("SELECT gst_number FROM users WHERE username = %s AND user_password = %s",(decoded['username'], decoded['password']))
        rows = cur.fetchone()
        table = str(request.form['branch']) + "_" + str(rows[0])
        query = "SELECT stock FROM "+ table +" WHERE sku = " + id
        cur.close()
        con.close()
        cs = checkstock.Stock()
        cs.connect()
        result = cs.getStock(query)
        return jsonify(result)
    else:
        return jsonify('Missing or invalid Authorization header.'), 401
    
@app.route('/recommend', methods=['POST'])
def recommend():
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        decoded = {}
        try:
            decoded = jwt.decode(token, "123", algorithms=["HS256"])
        except Exception as e:
            return jsonify('Invalid or expired token.'), 401
        
        brand = request.form['brand']
        color = request.form['color']
        battery_life = request.form['battery_life']
        max_price = request.form['max_price']
        rc = recommendProduct.LaptopRecommendationSystem("https://raw.githubusercontent.com/SkullCreek/BillingApp/main/server/Recommend%20Product/Projectt.csv")
        result = rc.recommend_laptops(brand,color,int(battery_life),int(max_price))
        return jsonify(result.to_dict())
    else:
        return jsonify('Missing or invalid Authorization header.'), 401

if __name__ == '__main__':
    app.run()