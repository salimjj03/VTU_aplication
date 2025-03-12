#!/usr/bin/env python3
"""

"""

from api.v1.views import app_view, network
from flask import request, jsonify
from modules.engine.db import Db
from modules.user import User
from modules.transaction import Transaction
from modules.cable import Cable
from modules.config import Config
from modules.platform import Platform
from modules.bill import Bill
from flask_jwt_extended import jwt_required
from sqlalchemy import and_, desc
import requests
import uuid
from datetime import datetime
from flask_jwt_extended import get_jwt_identity


@app_view.route("/electricity", methods=["POST", "GET"], strict_slashes="False")
@jwt_required()
def electricity():
    """

    :return:
    """
    
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

    if request.method == "POST":
        data = request.get_json()

        planId = data.get("planId")
        amount = data.get("amount")
        meterNumber = data.get("meterNumber")
        name = data.get("name")
        address = data.get("address")

        if meterNumber is None:
            return jsonify({
                "status": "error",
                "message": "Meter number is empty"
            })

        if planId is None:
            return jsonify({
                "status": "error",
                "message": "plan id is empty"
            })

        if amount is None:
            return jsonify({
                "status": "error",
                "message": "amount is empty"
            })

        if name is None:
            return jsonify({
                "status": "error",
                "message": "name is empty"
            })

        if address is None:
            return jsonify({
                "status": "error",
                "message": "address is empty"
            })

        select_bill = Db.db_session.query(Bill).filter_by(id=planId).first()
        amount = int(amount)

        if amount < 500:
            return jsonify({
                "status": "error",
                "message": "Amount is too low"
            })

        try:
            user_name = get_jwt_identity()
            user = Db.db_session.query(User).filter_by(user_name=user_name).with_for_update().one()
            balance = user.balance
            if balance < amount:
                return jsonify({"status": "error", "message": "Insufficient Funds"}), 400

            new_balance = balance - amount
            user.balance = new_balance

            api_data = {
                "meterNumber": meterNumber,
                "planId": planId,
                "amount": amount,
                "address": address,
                "name": name
            }
            url = "https://www.sahrvtu.com/api/v1/bills"
            headers = {
                "Authorization": "Bearer {}".format(platform.api_token),
                "Content-Type": "application/json"
            }
            response = requests.post(
                url=url,
                json=api_data,
                headers=headers,
                # timeout=180
                )

            response = response.json()
            print(response)
            if response.get("status") is False:
                user.balance = balance

            transaction = {
                "t_type": "Electricity",
                "t_disc": "{} Transaction OF {} TO {}".format(
                    select_bill.name,
                    amount,
                    meterNumber
                ),
                "user_name": user.user_name,
                "channel": "Electricity",
                "amount": amount,
                "amount_before": balance,
                "amount_after": new_balance if response.get("status") is True else balance,
                "t_date": datetime.utcnow(),
                "ref": str(uuid.uuid4()),
                "details": "failed" if response.get("status") is False else "Success",
                "status": "successful" if response.get("status") is True else "failed",
                "rtr": response.get("token") if response.get("status") is True else None
            }
            new_transaction = Transaction(**transaction)
            Db.db_session.add(new_transaction)
            Db.db_session.commit()

            if response.get("status") is True:
                return jsonify({"status": "success", "message": response.get("token") }), 200
            else:
                return jsonify({"status": "error", "message": "Transaction failed"}), 501
        except requests.Timeout:
            return jsonify({"status": "error", "message": "Request timed out after 120 seconds"}), 503

        except requests.ConnectionError:
            return jsonify({"status": "error", "message": "Connection Error"}), 503

    user_name = get_jwt_identity()
    user = Db.db_session.query(User).filter_by(user_name=user_name).first()

    data = Db.db_session.query(Bill).filter_by(status="active").all()
    bills = [b.to_dict() for b in data]
    return jsonify({"bills":bills, "balance": user.balance})


@app_view.route("/electricity_validation", methods=["POST"], strict_slashes="False")
@jwt_required()
def electricity_validation():
    """

    """
    
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

    meterNumber = data.get("meterNumber")
    planId = data.get("planId")

    if meterNumber is None:
        return jsonify({
            "status": "error",
            "message": "Meter number is empty"
        })

    if planId is None:
        return jsonify({
            "status": "error",
            "message": "plan id is empty"
        })

    api_data = {
        "meterNumber": meterNumber,
        "planId": planId
    }
    url = "https://www.sahrvtu.com/api/v1/bills-validation"
    headers = {
        "Authorization": "Bearer {}".format(platform.api_token),
        "Content-Type": "application/json"
    }

    try:
        res = requests.post(url=url,
            json=api_data,
            headers=headers,
            # timeout=180
            )
    except:
        return jsonify({
            "status": "error",
            "message": "Network problem"
        })
    return jsonify(res.json())


@app_view.route("/view_electricity", methods=["PUT", "GET"], strict_slashes="False")
@jwt_required()
def view_electricity():
    """

    """

    if request.method == "GET":
        bills = Db.all("Bill")
        json_data =  [bill.to_dict() for bill in bills]
        return jsonify(json_data), 200

    data = request.get_json()
    if data is None:
        return jsonify({"status": "error", "message": "form empty"}), 400

    plan_id =  data.get("id")
    if plan_id is None or plan_id == "":
        return jsonify({"status": "error", "message": "Id is none"}), 400

    status = data.get("status")
    if status is None or status == "":
        return jsonify({"status": "error", "message": "status is empty"}), 400

    charges = data.get("charges")
    if charges is None or charges == "":
        return jsonify({"status": "error", "message": "charges is None"}), 400

    elect = Db.db_session.query(Bill).filter_by(id=plan_id).first()
    if elect is None:
        return jsonify({"status": "error", "message": "Invalid Id"}), 400

    try:
        elect.update(**{"status": status, "charges": charges})
    except:
        return jsonify({"status": "error", "message": "Update failed"}), 400
    return jsonify({"status": "success", "message": "Record updated successfully"}), 200


