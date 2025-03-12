# This is a sample Python script.

# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool win

from modules.base import Base
from modules.user import User
from modules.admin import Admin
from modules.transaction import Transaction
from modules.engine.db import Db
from modules.data_plan import DataPlan
from modules import storage
from modules.airtime_type import AirtimeType
from modules.platform import Platform
from modules.data_paln_id import DataPlanId

dic = {
#            #"name": "SN",
            "full_name": "Admin Admin",
            "user_name": "admin",
            "email": "admin@gmail.com",
            "phone_no": "09020934923",
            "password": "admin"
       }

dic2 = {
    "name": "sme Plug",
    "platform_id": 2,
    "api_token": "290835aa762eb578152bd2a1ebe5ad4da77d1593909bf6505893bd7ee13e08ad"
}

dic3 = {
    "platform_id": 2,
    "plan_type_id": "b72a0893-1b3a-4c3e-8cc4-a7cde56f7e07",
    "network_id": 4,
    # "mb_500": 80,
    # "gb_1": 50,
    #  "gb_2": 30,
    # "gb_3": 2224,
    # "gb_5": 2225,
}

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

plan = Db.db_session.query(DataPlan).filter_by(id=101).first()
user = Db.db_session.query(User).where(User.user_name == "orhan").first()

print(plan.is_available_bundle(user))
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

