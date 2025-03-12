#!/usr/bin/env python3
""" Airtime View """

from modules.network import Network
from modules.transaction import Transaction
from api.v1.views import app_view
from flask import render_template, url_for, request, jsonify
from modules.engine.db import Db
from modules.airtime import Airtime
from modules.platform import Platform
from modules.airtime_type import AirtimeType
from sqlalchemy.exc import IntegrityError
from modules.user import User
import requests
from datetime import datetime
import uuid
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import and_
import json

@app_view.route("/airtime", methods=["GET", "POST"], strict_slashes=False)
@app_view.route("/airtime/<airtime_id>", methods=["DELETE"], strict_slashes=False)
@jwt_required()
def airtime(airtime_id=None):
    """

    :return:
    """

    if request.method == "GET":

        all_airtime = Db.db_session.query(Airtime).all()
        result = [a.to_dict() for a in all_airtime]
        return  jsonify(result), 200


    if request.method == "POST":
        if Airtime.role_validation("admin") is False:
            return jsonify({"status": "error", "message": "not allowed"}), 401

        data = request.get_json()
        if data is None or data == "":
            return jsonify({"status": "error", "message": "Form is empty"}), 400

        network_t = Db.db_session.query(Network).filter_by(network_id=data.get("network_id")).first()
        airtime_t = Db.db_session.query(AirtimeType).filter_by(id=data.get("airtime_type")).first()
        name = "{} {}".format(network_t.name, airtime_t.name)

        if Db.db_session.query(Airtime).filter_by(name=name).first() is not None:
            return jsonify({"status": "error", "message": "Airtime exist"}), 400

        try:
            new_airtime = Airtime(**data)
            new_airtime.name = name
            new_airtime.save()
            return jsonify({"status": "success", "message": "Airtime added successfully"}), 201
        except:
            return jsonify({"status": "error", "message": "Server Error"}), 500

    if request.method == "DELETE":
        airtime_id = airtime_id
        if airtime_id == "" or airtime_id is None:
            return jsonify({"status": "error", "message": "Id is Empty"}), 400
        air_time = Db.db_session.query(Airtime).filter_by(id=airtime_id).first()
        if airtime_id is None:
            return jsonify({"status": "error", "message": "Invalid Id"}), 400
        try:
            air_time.delete()
            return jsonify({"status": "success", "message": "Record Deleted Successfully"}), 200
        except:
            return jsonify({"status": "error", "message": "Server Error"}), 500

@app_view.route("airtime_type", methods=["GET", "POST", "PUT"], strict_slashes=False)
@app_view.route("airtime_type/<type_id>", methods=["DELETE"], strict_slashes=False)
@jwt_required()
def airtime_type(type_id=None):
    """

    :return:
    """

    if request.method == "GET":

        airtime_t = Db.all("AirtimeType")
        result = [t.to_dict() for t in airtime_t]
        return jsonify(result), 200

    if request.method == "POST":
        if Airtime.role_validation("admin") is False:
            return jsonify({"status": "error", "message": "not allowed"}), 401
        data = request.get_json()
        if data is None or data == "":
            return jsonify({"status": "error", "message": "Form is empty"}), 400

        if Db.db_session.query(AirtimeType).filter_by(name=data.get("name")).first() is not None:
            return jsonify({"status": "error", "message": "Name Exist"}), 400

        try:
            new_airtime_type = AirtimeType(**data)
            new_airtime_type.save()
            return jsonify({"status": "success", "message": "Record Added Successfully"}), 201
        except:
            return jsonify({"status": "error", "message": "Server Error"}), 500

    if request.method == "DELETE":
        if Airtime.role_validation("admin") is False:
            return jsonify({"status": "error", "message": "not allowed"}), 401
        data = type_id
        if data is None or data == "":
            return jsonify({"status": "error", "message": "ID is empty"}), 400

        airtime_t = Db.db_session.query(AirtimeType).filter_by(id=data).first()
        if airtime_t is None:
            return jsonify({"status": "error", "message": "Invalid ID"}), 400

        try:
            airtime_t.delete()
            return jsonify({"status": "success", "message": "Record deleted Successfully"}), 201

        except IntegrityError:
            return jsonify({"status": "error", "message": "Can't delete foreignkey constraint"}), 501
        except:
            jsonify({"status": "error", "message": "Server error"}), 501

    if request.method == "PUT":
        if Airtime.role_validation("admin") is False:
            return jsonify({"status": "error", "message": "not allowed"}), 401

        data = request.get_json()
        if data is None or data == "":
            return jsonify({"status": "error", "message": "Form is empty"}), 400

        airtime_t = Db.db_session.query(AirtimeType).filter_by(id=data.get("id")).first()
        if airtime_t is None:
            return jsonify({"status": "error", "message": "Invalid ID"}), 400

        try:
            airtime_t.update(**data)
            return jsonify({"status": "success", "message": "Record updated Successfully"}), 201
        except:
            return jsonify({"status": "error", "message": "Server Error"}), 501


@app_view.route("/buy_airtime", methods=["GET", "POST"], strict_slashes=False)
@jwt_required()
def buy_airtime():
    """

    :return:
    """

    if request.method == "POST":
        
        # sahr_token = Config.get_sahr_token()
        # if sahr_token is None:
        #     return jsonify({
        #             "status": "error",
        #             "message": "No api connection"
        #         }), 400

        platform = Db.db_session.query(Platform).filter_by(platform_id=1).first()
        if platform is None:
            return jsonify({
                "status": "error",
                "message": "Error,  Invalid platform Id"
            }), 400
        
        data = request.get_json()

        try:
            user_name = get_jwt_identity()
            user = Db.db_session.query(User).filter_by(user_name=user_name).with_for_update().one()
            balance = user.balance
            if balance < int(data.get("amount")):
                return jsonify({"status": "error", "message": "Insufficient Funds"}), 400

            if int(data.get("amount")) < 10:
                return jsonify({"status": "error", "message": "Amount is too low"}), 400

            selected_type = Db.db_session.query(AirtimeType).filter_by(name=data.get("type")).first()
            if selected_type and selected_type.disc > 0:
                commission = int(user.percent(data.get("amount"), selected_type.disc))
            else:
                commission = 0

            network = Db.db_session.query(Network).filter_by(network_id=data.get("network_id")).first().name
            new_balance = balance - int(data.get("amount"))
            user.balance = new_balance

            url = "https://www.sahrvtu.com/api/v1/airtime"
            headers = {
                "Authorization": "Bearer {}".format(platform.api_token),
                "Content-Type": "application/json"
            }

            json_data = {
                "network_id": data.get("network_id"),
                "phone": data.get("phone"),
                "amount": data.get("amount"),
                "type": data.get("type")
            }

            response = requests.post(
                url=url,
                json=json_data,
                headers=headers,
                #timeout=180
            )
            response = response.json()
            if response.get("status") is False:
                user.balance = balance

            transaction = {
                "t_type": "Airtime",
                "t_disc": "{} AIRTIME OF {} TO {}".format(
                    network,
                    data.get("amount"),
                    data.get("phone")
                ),
                "user_name": user.user_name,
                "channel": "Airtime",
                "amount": data.get("amount"),
                "amount_before": balance,
                "amount_after": new_balance if response.get("status") is True else balance,
                "t_date": datetime.utcnow(),
                "ref": str(uuid.uuid4()),
                "details": "failed" if response.get("status") == False else "Success",
                "status": "successful" if response.get("status") == True else "failed"
            }
            new_transaction = Transaction(**transaction)
            Db.db_session.add(new_transaction)
            if commission != 0 and response.get("status") is True:
                commission_t = {
                    "t_type": "commission",
                    "t_disc": "Commission OF {} TO {} for Airtime purchase".format(
                        commission,
                        user.user_name
                    ),
                    "user_name": user.user_name,
                    "channel": "Airtime",
                    "amount": commission,
                    "amount_before": user.commission,
                    "amount_after": user.commission + commission,
                    "t_date": datetime.utcnow(),
                    "ref": str(uuid.uuid4()),
                    "details": "failed" if response.get("status") == False else "Success",
                    "status": "successful" if response.get("status") == True else "failed"
                }
                com_transaction = Transaction(**commission_t)
                Db.db_session.add(com_transaction)
                user.commission += commission
            Db.db_session.commit()

            if response.get("status") is True:
                return jsonify({"status": "success", "message": "Airtime purchase was successful"}), 200
            else:
                return jsonify({"status": "error", "message": "Transaction failed"}), 501
        except requests.Timeout:
            return jsonify({"status": "error", "message": "Request timed out after 120 seconds"}), 503

        except requests.ConnectionError:
            return jsonify({"status": "error", "message": "Connection Error"}), 503

