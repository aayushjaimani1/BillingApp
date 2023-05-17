import json
from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
import pandas as pd
import jwt
import psycopg2 as postgre
import recommendProduct
import MultipleProduct
import item
import checkstock
import coupon
import payment
import invoices
import pdfkit

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
        rc = recommendProduct.LaptopRecommendationSystem("https://raw.githubusercontent.com/SkullCreek/BillingApp/main/server/Inventory/Projectt.csv")
        result = rc.recommend_laptops(brand,color,int(battery_life),int(max_price))
        return jsonify(result.to_dict())
    else:
        return jsonify('Missing or invalid Authorization header.'), 401
    
@app.route('/addcoupon', methods=['POST'])
def addCoupon():
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        decoded = {}
        try:
            decoded = jwt.decode(token, "123", algorithms=["HS256"])
        except Exception as e:
            return jsonify('Invalid or expired token.'), 401
        
        coupon_id = request.form['coupon']
        coupon_percentage = request.form['percentage']
        min_amount = request.form['min_amount']

        cpn = coupon.Coupon()
        cpn.connect()
        cpn.add(decoded)
        if cpn.checkTable():
            if cpn.addCoupon(coupon_id,coupon_percentage,min_amount):
                cpn.close()
                return jsonify("Coupon Generated.")
            else:
                return jsonify("Coupon Already Exists.")
        return jsonify("Error")
        

    else:
        return jsonify('Missing or invalid Authorization header.'), 401
    
@app.route('/coupons', methods=['POST'])
def getCoupon():
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        decoded = {}
        try:
            decoded = jwt.decode(token, "123", algorithms=["HS256"])
        except Exception as e:
            return jsonify('Invalid or expired token.'), 401

        cpn = coupon.Coupon()
        cpn.connect()
        cpn.add(decoded)
        if cpn.checkTable():
            result = cpn.getCoupon()
            cpn.close()
            return result
        return jsonify("Error")
        

    else:
        return jsonify('Missing or invalid Authorization header.'), 401
    
@app.route('/delcoupon', methods=['POST'])
def delCoupon():
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        decoded = {}
        try:
            decoded = jwt.decode(token, "123", algorithms=["HS256"])
        except Exception as e:
            return jsonify('Invalid or expired token.'), 401

        cpn = coupon.Coupon()
        cpn.connect()
        cpn.add(decoded)
        if cpn.checkTable():
            couponId = request.form['coupon_id']
            if cpn.deleteCoupon(couponId):
                cpn.close()
                return jsonify("Coupon Deleted")
            else:
                return jsonify("Coupon Not Present")
        return jsonify("Error")
        

    else:
        return jsonify('Missing or invalid Authorization header.'), 401
    
@app.route('/apply', methods=['POST'])
def applyCoupon():
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        decoded = {}
        try:
            decoded = jwt.decode(token, "123", algorithms=["HS256"])
        except Exception as e:
            return jsonify('Invalid or expired token.'), 401

        cpn = coupon.Coupon()
        cpn.connect()
        cpn.add(decoded)
        if cpn.checkTable():
            couponId = request.form['coupon_id']
            result = cpn.apply(couponId)
            cpn.close()
            return result
        
        return jsonify("Error")
        

    else:
        return jsonify('Missing or invalid Authorization header.'), 401
    
@app.route('/pay_now', methods=['POST'])
def payNow():
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        decoded = {}
        try:
            decoded = jwt.decode(token, "123", algorithms=["HS256"])
        except Exception as e:
            return jsonify('Invalid or expired token.'), 401

        customerInfo = json.loads(request.form['customer_details'])
        cart = json.loads(request.form['product_in_cart'])
        summary = json.loads(request.form['summary'])
        branch = request.form['branch']
        payd = payment.Payment()
        payd.connect()
        payd.getPaymentDetails(decoded)
        payload = {
            'customerInfo': customerInfo,
            'cart': cart,
            'summary': summary,
            'Auth': decoded,
            'branch': branch
        }
        encoded = jwt.encode(payload, "123", algorithm="HS256")

        payment_link = payd.pay(customerInfo['fname'], customerInfo['email'], summary['total'], encoded)
        return jsonify(payment_link)

    else:
        return jsonify('Missing or invalid Authorization header.'), 401
    
@app.route('/paymentStatus', methods=['GET'])
def paymentStatus():
    payload = request.args.get('payload')

    payment_details = {}
    try:
        payment_details = jwt.decode(payload, "123", algorithms=["HS256"])
    except Exception as e:
        return jsonify('Invalid or expired token.'), 401
    
    username = payment_details['Auth']['username']
    password = payment_details['Auth']['password']
    customerInfo = payment_details['customerInfo']
    cart = payment_details['cart']
    summary = payment_details['summary']
    branch = payment_details['branch']
    print(username)
    pd = payment.Payment()
    pd.connect()
    customer_id = pd.addCustomer(username, password, customerInfo)
    result = pd.addInvoice(username, password, customer_id, cart, branch,summary)
    print(result)
    pd.close()
    if result == "success":
        return redirect("http://localhost:4200/dashboard/invoice")
    else:
        return redirect("http://localhost:4200/dashboard")
    
@app.route('/invoices', methods=['POST'])
def getInvoices():
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        decoded = {}
        try:
            decoded = jwt.decode(token, "123", algorithms=["HS256"])
        except Exception as e:
            return jsonify('Invalid or expired token.'), 401

        inv = invoices.Invoice()
        inv.connect()
        return jsonify(inv.getInvoices(decoded['username'], decoded['password']))
    else:
        return jsonify('Missing or invalid Authorization header.'), 401
    
@app.route('/print', methods=['POST'])
def printInvoice():
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        decoded = {}
        try:
            decoded = jwt.decode(token, "123", algorithms=["HS256"])
        except Exception as e:
            return jsonify('Invalid or expired token.'), 401

        id = request.form['id']
        inv = invoices.Invoice()
        inv.connect()
        printable_data = inv.getFullInvoices(decoded['username'], decoded['password'],id)
        table = """"""
        for i in range(0, len(printable_data[0]['cart'])):
            table = table + """<tr class="row"><td class="col col_no"><p>"""+ str(printable_data[0]['cart'][i]['id']) +"""</p></td><td class="col col_des"><p class="bold">"""+ str(printable_data[0]['cart'][i]['name']) +"""</p></td><td class="col col_price"><p>Rs """+ str(printable_data[0]['cart'][i]['price']) +"""</p></td><td class="col col_qty"><p>"""+ str(printable_data[0]['cart'][i]['quantity']) +"""</p></td><td class="col col_total"><p>"""+ str(printable_data[0]['cart'][i]['amount']) +"""</p></td></tr>"""
        html_content = """<head> <title>Invoice </title>   <style> @media print{ :root { --primary: #7027c4; --secondary: #3d3d3d; --white: #fff; } *{ margin: 0; padding: 0; box-sizing: border-box; font-family: 'Roboto', sans-serif; } body{ background: var(--secondary); padding: 50px; color: var(--secondary); display: flex; align-items: center; justify-content: center; font-size: 14px; } table{ width: 100%!important; } td{ width: 20%; } th{ width: 20%; text-align: left; } .bold{ font-weight: 900; } .light{ font-weight: 100; } .wrapper{ background: var(--white); padding: 30px; } .invoice_wrapper{ border: 3px solid var(--primary); width: 700px; max-width: 100%; } .invoice_wrapper .header .logo_invoice_wrap, .invoice_wrapper .header .bill_total_wrap{ display: flex; justify-content: space-between; padding: 30px; } .invoice_wrapper .header .logo_sec{ display: flex; align-items: center; } .invoice_wrapper .header .logo_sec .title_wrap{ margin-left: 5px; } .invoice_wrapper .header .logo_sec .title_wrap .title{ text-transform: uppercase; font-size: 18px; color: var(--primary); } .invoice_wrapper .header .logo_sec .title_wrap .sub_title{ font-size: 12px; } .invoice_wrapper .header .invoice_sec, .invoice_wrapper .header .bill_total_wrap .total_wrap{ text-align: right; } .invoice_wrapper .header .invoice_sec .invoice{ font-size: 28px; color: var(--primary); } .invoice_wrapper .header .invoice_sec .invoice_no, .invoice_wrapper .header .invoice_sec .date{ display: flex; width: 100%; } .invoice_wrapper .header .invoice_sec .invoice_no span:first-child, .invoice_wrapper .header .invoice_sec .date span:first-child{ width: 70px; text-align: left; } .invoice_wrapper .header .invoice_sec .invoice_no span:last-child, .invoice_wrapper .header .invoice_sec .date span:last-child{ width: calc(100% - 70px); } .invoice_wrapper .header .bill_total_wrap .total_wrap .price, .invoice_wrapper .header .bill_total_wrap .bill_sec .name{ color: var(--primary); font-size: 20px; } .invoice_wrapper .body .main_table .table_header{ background: var(--primary); } .invoice_wrapper .body .main_table .table_header .row{ color: var(--white); font-size: 18px; border-bottom: 0px; } .invoice_wrapper .body .main_table .row{ display: flex; border-bottom: 1px solid var(--secondary); } .invoice_wrapper .body .main_table .row .col{ padding: 10px; } .invoice_wrapper .body .paymethod_grandtotal_wrap{ display: flex; justify-content: space-between; padding: 5px 0 30px; align-items: flex-end; } .invoice_wrapper .body .paymethod_grandtotal_wrap .paymethod_sec{ padding-left: 30px; } .invoice_wrapper .body .paymethod_grandtotal_wrap .grandtotal_sec{ width: 30%; } .invoice_wrapper .body .paymethod_grandtotal_wrap .grandtotal_sec p{ display: flex; width: 100%; padding-bottom: 5px; } .invoice_wrapper .body .paymethod_grandtotal_wrap .grandtotal_sec p span{ padding: 0 10px; } .invoice_wrapper .body .paymethod_grandtotal_wrap .grandtotal_sec p span:first-child{ width: 60%; } .invoice_wrapper .body .paymethod_grandtotal_wrap .grandtotal_sec p span:last-child{ width: 40%; text-align: right; } .invoice_wrapper .body .paymethod_grandtotal_wrap .grandtotal_sec p:last-child span{ background: var(--primary); padding: 10px; color: #fff; } .invoice_wrapper .footer{ padding: 30px; } .invoice_wrapper .footer > p{ color: var(--primary); text-decoration: underline; font-size: 18px; padding-bottom: 5px; } .invoice_wrapper .footer .terms .tc{ font-size: 16px; }}</style> </head> <body> <div class="wrapper"> <div class="invoice_wrapper"> <div class="header"> <div class="logo_invoice_wrap"> <div class="logo_sec"> <div class="title_wrap"> <p class="title bold">Invoice2Ease</p> </div> </div> <div class="invoice_sec"> <p class="invoice bold">INVOICE</p> <p class="invoice_no"> <span class="bold">Invoice</span> <span>""" + str(printable_data[0]['purchase_id']) + """</span> </p> <p class="date"> <span class="bold">Date</span> <span>"""+ str(printable_data[0]['date']) +"""</span> </p> </div> </div> <div class="bill_total_wrap"> <div class="bill_sec"> <p>Bill To</p> <p class="bold name">"""+ str(printable_data[0]['customer_details']['fname']) +"""</p> <span> """ + str(printable_data[0]['customer_details']['address']).replace('/','') +"""<br/> """+ str(printable_data[0]['customer_details']['phone']) +""" </span> </div> </div> </div> <div class="body"><table class="main_table"><thead class="table_header"><tr class="row"><th class="col col_no">NO.</th><th class="col col_des">ITEM DESCRIPTION</th><th class="col col_price">PRICE</th><th class="col col_qty">QTY</th><th class="col col_total">TOTAL</th></tr></thead><tbody class="table_body">  """+ table +"""  </tbody></table><div class="paymethod_grandtotal_wrap"> <div class="paymethod_sec"> <p class="bold">Payment Method</p> <p>Visa, master Card and We accept Cheque</p> </div> <div class="grandtotal_sec"> <p class="bold"> <span>SUB TOTAL</span> <span>  """+ str(printable_data[0]['summary']['subtotal']) + """   </span> </p> <p> <span>Discount </span> <span> -""" + str(printable_data[0]['summary']['discount']) + """</span> </p> <p> <span>CGST 9%</span> <span>"""+ str(printable_data[0]['summary']['cgst']) +"""</span> </p> <p> <span>SGST 9%</span> <span>"""+str(printable_data[0]['summary']['sgst'])+ """</span> </p> <p class="bold"> <span>Grand Total</span> <span>"""+str(printable_data[0]['summary']['total'])+"""</span> </p> </div> </div> </div> <div class="footer"> <p>Thank you and Best Wishes</p></div> </div> </div> </body>"""

        
        return jsonify(html_content)
    else:
        return jsonify('Missing or invalid Authorization header.'), 401

if __name__ == '__main__':
    app.run()