# # This is a sample Python script.
#
# # Press Shift+F10 to execute it or replace it with your code.
# # Press Double Shift to search everywhere for classes, files, tool win
#
# from modules.base import Base
# from modules.user import User
# from modules.admin import Admin
# from modules.transaction import Transaction
# from modules.engine.db import Db
# from modules.data_plan import DataPlan
# from modules import storage
# from modules.airtime_type import AirtimeType
# from modules.platform import Platform
# from modules.data_paln_id import DataPlanId
#
# dic = {
# #            #"name": "SN",
#             "full_name": "Admin Admin",
#             "user_name": "admin",
#             "email": "admin@gmail.com",
#             "phone_no": "09020934923",
#             "password": "admin"
#        }
#
# dic2 = {
#     "name": "sme Plug",
#     "platform_id": 2,
#     "api_token": "290835aa762eb578152bd2a1ebe5ad4da77d1593909bf6505893bd7ee13e08ad"
# }
#
# dic3 = {
#     "platform_id": 2,
#     "plan_type_id": "b72a0893-1b3a-4c3e-8cc4-a7cde56f7e07",
#     "network_id": 4,
#     # "mb_500": 80,
#     # "gb_1": 50,
#     #  "gb_2": 30,
#     # "gb_3": 2224,
#     # "gb_5": 2225,
# }

#
# api_k = 'MK_PROD_9X7MH869G9'
# sec_k = 'TYECL3CPBM5T4H397D8L3W5GJZRMEZKD'
# key = "{}:{}".format(api_k, sec_k)
# import time
# user = DataPlanId(**dic3)
# user.save()
#print(Db.all("Network"))
#Db.db_session.commit()
#print(Db.db_session.query(AirtimeType).all())

# plan = Db.db_session.query(DataPlan).filter_by(id=101).first()
# user = Db.db_session.query(User).where(User.user_name == "orhan").first()
#
# print(plan.is_available_bundle(user))
#print(user.get_payment_point())
#print(user.to_dict())
#data = {"balance": 10000, "phone_no": "080"}
#user.update(**data)
#time.sleep(5)
#user = Db.db_session.query(User).where(User.user_name == "feeya").first()
#print(user.to_base64("salim", "aliyu"))
#items = [l for l in range(102)]
#print(user.get_page(items, 11, 10))
#print(str(user.encord_str(key))[1:])
#ur.user_name = "feey"
#Db.db_session.commit()
#print(Db.db_session.query(Admin).all())
#print(Db.db_session.query(User).where(User.user_name == "feey").first())
#print(Db.db_session.query(Transaction).all())

import requests
from datetime import datetime


def make_app_request(url, payload, headers=None):
    """
    Sends a POST request to the specified URL with the given payload and headers.

    Args:
        url (str): The target URL for the request.
        payload (dict): The data to send in the request body.
        headers (dict, optional): Additional HTTP headers.

    Returns:
        tuple: (HTTP status code, response JSON)
    """
    default_headers = {
        "Content-Type": "application/json",
        "User-Agent": "okhttp/4.10.0",
        "x-country-code": "nga",
        "access-control-allow-origin": "*"
    }

    if headers:
        default_headers.update(headers)

    try:
        response = requests.post(url, json=payload, headers=default_headers, timeout=10)
        return response.status_code, response.json()
    except requests.exceptions.RequestException as e:
        return None, {"error": str(e)}


def get_access_token(phone):
    """
    Fetches the access token for a given phone number.

    Args:
        phone (str): The phone number.

    Returns:
        str: Access token
    """
    # Simulating an API call to retrieve the access token
    return "sample_access_token"  # Replace with actual token retrieval logic


def sub_sme_app(ben, size, db_conn):
    """
    Processes a SME data transfer request.

    Args:
        ben (str): The beneficiary phone number.
        size (str): The data bundle size (e.g., '500', '1000', '2000', etc.).
        db_conn (mysql.connector.connection_cext.CMySQLConnection): MySQL database connection.

    Returns:
        tuple: (status, notification message)
    """

    # Fetch SIM PIN and other details from database
    cursor = db_conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM sim_pin")
    sim_pin = cursor.fetchone()

    pin = sim_pin["pin"]
    cloud_phone = sim_pin["phone"]

    token = get_access_token(cloud_phone)

    # Mapping size to plan codes
    plan_mapping = {
        "500": "ME2U_NG_Data2Share_425",
        "1000": "ME2U_NG_Data2Share_426",
        "2000": "ME2U_NG_Data2Share_427",
        "3000": "ME2U_NG_Data2Share_775",
        "5000": "ME2U_NG_Data2Share_428",
        "10000": "ME2U_NG_Data2Share_1015",
    }

    plan = plan_mapping.get(size)
    if not plan:
        return "failed", "Invalid data size selected."

    new_phone = "+234" + cloud_phone[1:]  # Convert phone to international format
    req_headers = {
        "Authorization": f"Bearer {token}",
        "channel": "MTNAPPNXG",
        "msisdn-code": "234",
        "host": "mtn-dxl-share-data.mymtnnxgeaprod.mtnnigeria.net"
    }

    ben = "234" + ben[1:]  # Convert beneficiary number

    payload = {
        "pin": pin,
        "productCode": plan,
        "receiverMsisdn": ben,
        "agentId": "MTNAPPNXG",
    }

    c_date_t = datetime.now().strftime("%d-%m-%Y %I:%M:%S %p")
    c_date = datetime.now().strftime("%Y-%m-%d")

    # Insert processing record into the `clouds` table
    # insert_query = """
    #     INSERT INTO clouds(`size`, `phone`, `res`, `date_time`, `status`, `t_date`, `ref`, `main_res`)
    #     VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    # """
    # cursor.execute(insert_query, (size, ben, "IN PROCESSING", c_date_t, "processing", c_date, "", ""))
    # db_conn.commit()
    # t_id = cursor.lastrowid  # Get last inserted ID

    # Make the API request
    url = "https://mtn-dxl-share-data.mymtnnxgeaprod.mtnnigeria.net/v1/transfer/customers"
    status_code, main_res = make_app_request(url, payload, req_headers)

    if status_code == 200 and "error" not in main_res:
        notification = main_res.get("data", {}).get("notification", "")
        if notification:
            status = "success"
        else:
            status = "failed"
    else:
        status = "failed"
        notification = main_res.get("message", "Transaction failed.")
        if main_res.get("status") == "4100":
            notification = f"Activation of SHARE {size}MB was not successful. Please try again."

    # Update transaction record in database
    update_query = """
        UPDATE clouds SET `res` = %s, `status` = %s, `main_res` = %s WHERE id = %s
    """
    cursor.execute(update_query, (notification, status, str(main_res), t_id))
    db_conn.commit()
    cursor.close()

    return status, notification

# Example usage (assuming a valid MySQL connection `db_conn`)
# db_conn = mysql.connector.connect(host="localhost", user="root", password="", database="your_db")
# result = sub_sme_app("08012345678", "500", db_conn)
# print(result)
