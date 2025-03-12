#!/usr/bin/env python3
"""
User module
"""
from flask import jsonify
from uuid import uuid4
from modules.base import Base, DB_base
from sqlalchemy import Column, String, Integer, Float, Numeric, ForeignKey, Text
import requests
from modules.monnify import Monnify
import json
from modules.config import Config

class User(Base, DB_base):
    """
    user class which inherite from Base and db_base
    """
    __tablename__ = "users"

    full_name = Column(String(255), nullable=False)
    user_name = Column(String(255), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    phone_no = Column(String(45), unique=True, nullable=False)
    ref_id = Column(String(45), ForeignKey("users.user_name"))
    password = Column(String(255), nullable=False)
    balance = Column(Numeric(10), default=0)
    commission = Column(Numeric(10), default=0)
    mtn_sme_bundle = Column(Float, default=0)
    mtn_cg_bundle = Column(Float, default=0)
    airtel_cg_bundle = Column(Float, default=0)
    glo_cg_bundle = Column(Float, default=0)
    mobile_cg_bundle = Column(Float, default=0)
    type = Column(String(45), default="type_1", nullable=False)
    accounts = Column(String(255))
    payment_point =  Column(String(225))
    status = Column(String(45), default="un verified")
    pin = Column(Integer)
    accountReference = Column(String(255), unique=True)
    suspended = Column(String(45), default="False")
    bvn = Column(String(45))
    role = Column(String(225), default="user", nullable=False)
    auth_token = Column(String(225), default=str(uuid4()).replace("-", ""), unique=True, nullable=False)



    def account_reserve(self):
        """

        :return:
        """
        
        from modules.engine.db import Db
        
        config = Db.db_session.query(Config).first()

        if config and config.bvn:
            monnify_obj = Monnify()
            if monnify_obj:
                contract_code = Config.get_monnify().get("contract_code")
                url = 'https://api.monnify.com/api/v1/auth/login'
                headers = {
                    'Authorization': 'Basic {}'.format(monnify_obj.gat_token())
                }

                try:

                    result = requests.post(url, headers=headers)
                    url2 = "https://api.monnify.com/api/v2/bank-transfer/reserved-accounts"

                    data = {
                        "accountReference": self.user_name,
                        "accountName": self.full_name,
                        "currencyCode": "NGN",
                        "contractCode": contract_code,
                        "customerEmail": self.email,
                        "bvn": config.bvn if self.to_dict().get("bvn") == "" or self.to_dict().get("bvn") is None else self.bvn,
                        "customerName": self.full_name,
                        "getAllAvailableBanks": False,
                        "preferredBanks": ["035", "50515"]
                    }

                    head = {
                        "Authorization": "Bearer {}".format(result.json().get("responseBody").get("accessToken")),
                        "Content-Type": "application/json"
                    }

                    res = requests.post(url2, headers=head, json=data)

                    if res.json().get("requestSuccessful") is False:
                        print(res.json().get("responseMessage"))
                        return jsonify({"status": "error", "message": res.json().get("responseMessage")})

                    accounts = json.dumps(res.json().get("responseBody").get("accounts"))
                    self.update(**{"accounts": accounts})
                    print(res.json().get("responseMessage"))
                    return jsonify({
                        "status": "success",
                        "message": res.json().get("responseMessage"),
                        "accounts": res.json().get("responseBody").get("accounts")
                    })

                except requests.Timeout:
                    return jsonify({"status": "error", "message": "Time Out"})

                except requests.exceptions.ConnectionError:
                    return jsonify({"status": "error", "message": "Connection Error"})

                except:
                    return jsonify({"status": "error", "message": "Error occur"})
            else:
                return jsonify({"status": "error", "message": "Contact admin for monnify update"})
        return jsonify({"status": "error", "message": "Contact admin for Update BVN"})

    def get_reserve(self):
        """

        :return:
        """

        monnify_obj = Monnify()
        if monnify_obj.gat_token() is None or monnify_obj.gat_token() is False or monnify_obj.gat_token() == "":
            return None
        url = 'https://api.monnify.com/api/v1/auth/login'
        headers = {
            'Authorization': 'Basic {}'.format(monnify_obj.gat_token())
        }

        try:

            result = requests.post(url, headers=headers)
            url2 = "https://api.monnify.com/api/v2/bank-transfer/reserved-accounts/{}".format(self.user_name)

            head = {
                "Authorization": "Bearer {}".format(result.json().get("responseBody").get("accessToken")),
                "Content-Type": "application/json"
            }

            res = requests.get(url2, headers=head)

            if res.json().get("requestSuccessful") is True:
                if self.accounts is None:
                    accounts = json.dumps(res.json().get("responseBody").get("accounts"))
                    self.update(**{"accounts": accounts})
                    return {
                        "status": "success",
                        "message": "Accounts Created Successful",
                        "accounts": res.json().get("responseBody").get("accounts")}
                else:
                    return {"status": "error", "message": "Accounts Exist"}

        except requests.Timeout:
            return {"status": "error", "message": "Time Out"}

        except requests.ConnectionError:
            return {"status": "error", "message": "Connection Error"}

        return {"status": "error", "message": "Error occur"}

    def get_payment_point(self):
        """

        """

        payment_point = Config.get_payment_point()
        if payment_point:
            url = "https://api.paymentpoint.co/api/v1/createVirtualAccount"
            api_secret_key = payment_point.get("secret_key")
            api_key = payment_point.get("api_key")
            business_id = payment_point.get("business_id")

            data = {
                "email": self.email,
                "name": self.full_name,
                "phoneNumber": self.phone_no,
                "bankCode": ['20946'],
                "businessId": business_id,
            }

            headers = {
                "Authorization": "Bearer {}".format(api_secret_key),
                "Content-Type": "application/json",
                "api-key": api_key
            }

            res = requests.post(url, headers=headers, json=data)

            accounts = []
            if res.json().get("status") == "success":
                account = res.json().get("bankAccounts")
                for a in account:
                    accounts.append(a)
                #self.payment_point = json.dumps(accounts)
                self.update(**{"payment_point": json.dumps(accounts) })
            res_data = {
                "status": res.json().get("status"),
                "message": res.json().get("message"),
                "data": res.json().get("bankAccounts")
            }
            return res_data

    def bundles(self):
        """

        """

        bundles = [
            {
                "name": "mtn_sme_bundle",
                "amount": self.mtn_sme_bundle,
                "id": "MTN SME"
            },
            {
                "name": "mtn_cg_bundle",
                "amount": self.mtn_cg_bundle,
                "id": "MTN CG"
            },
            {
                "name": "airtel_cg_bundle",
                "amount": self.airtel_cg_bundle,
                "id": "AIRTEL CG"
            },
            {
                "name": "glo_cg_bundle",
                "amount": self.glo_cg_bundle,
                "id": "GLO CG"
            },
            {
                "name": "mobile_cg_bundle",
                "amount": self.mobile_cg_bundle,
                "id": "9MOBILE CG"
            },
        ]

        return bundles