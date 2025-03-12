#!/usr/bin/env python3
"""

"""

from api.v1.views import app_view, network
from flask import request, jsonify
from modules.engine.db import Db
from modules.user import User
from modules.platform import Platform
from modules.transaction import Transaction
from modules.cable import Cable
from modules.config import Config
from flask_jwt_extended import jwt_required
from sqlalchemy import and_, desc
import requests
import uuid
from datetime import datetime
from flask_jwt_extended import get_jwt_identity


@app_view.route("/cable", methods=["POST", "GET"], strict_slashes="False")
@jwt_required()
def cable():
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
        card_number = data.get("cardNumber")
        plan_id = data.get("planId")

        if card_number is None:
            return jsonify({
                "status": "error",
                "message": "card number is empty"
            }), 400

        if plan_id is None:
            return jsonify({
                "status": "error",
                "message": "plan id is empty"
            }), 400

        select_cable = Db.db_session.query(Cable).filter_by(id=plan_id).first()
        amount = int(select_cable.amount)

        try:
            user_name = get_jwt_identity()
            user = Db.db_session.query(User).filter_by(user_name=user_name).with_for_update().one()
            balance = user.balance
            if balance < amount:
                return jsonify({"status": "error", "message": "Insufficient Funds"}), 400

            new_balance = balance - amount
            user.balance = new_balance

            api_data = {
                "cardNumber": data.get("cardNumber"),
                "planId": data.get("planId")
            }
            url = "https://www.sahrvtu.com/api/v1/cable"
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
                "t_type": "Cable",
                "t_disc": "{} Subscription OF {} TO {}".format(
                    select_cable.name,
                    amount,
                    card_number
                ),
                "user_name": user.user_name,
                "channel": "Cable",
                "amount": amount,
                "amount_before": balance,
                "amount_after": new_balance if response.get("status") is True else balance,
                "t_date": datetime.utcnow(),
                "ref": str(uuid.uuid4()),
                "details": "failed" if response.get("status") == False else "Success",
                "status": "successful" if response.get("status") == True else "failed"
            }
            new_transaction = Transaction(**transaction)
            Db.db_session.add(new_transaction)
            Db.db_session.commit()

            if response.get("status") is True:
                return jsonify({"status": "success", "message": "Cable subscription was successful"}), 200
            else:
                return jsonify({"status": "error", "message": "Transaction failed"}), 501
        except requests.Timeout:
            return jsonify({"status": "error", "message": "Request timed out after 120 seconds"}), 503

        except requests.ConnectionError:
            return jsonify({"status": "error", "message": "Connection Error"}), 503

    user_name = get_jwt_identity()
    user = Db.db_session.query(User).filter_by(user_name=user_name).first()
    cables = {"gotv":[], "dstv":[], "startime":[] }


    data = Db.db_session.query(Cable).filter_by(status="active").all()
    for c in data:
        if c.decoder_id == "1":
            cables["gotv"].append(c.to_dict())
        elif c.decoder_id == "2":
            cables["dstv"].append(c.to_dict())
        elif c.decoder_id == "3":
            cables["startime"].append(c.to_dict())
    return jsonify({"cables":cables, "balance": user.balance})


@app_view.route("/cable_validation", methods=["POST"], strict_slashes="False")
@jwt_required()
def cable_validation():
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

    card_number = data.get("cardNumber")
    plan_id = data.get("planId")

    if card_number is None:
        return jsonify({
            "status": "error",
            "message": "card number is empty"
        }), 400

    if plan_id is None:
        return jsonify({
            "status": "error",
            "message": "plan id is empty"
        }), 400

    api_data = {
        "smart_card_number": card_number,
        "cable_id": plan_id
    }
    url = "https://www.sahrvtu.com/api/v1/cable-validation"
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
        }), 400
    return jsonify(res.json()), 200


@app_view.route("/view_cable", methods=["PUT", "GET"], strict_slashes="False")
@jwt_required()
def view_cable():
    """

    """

    if Cable.role_validation("admin") is False:
        return jsonify({"status": "error", "message": "not allowed"}), 401
    if request.method == "GET":
        cables = Db.all("Cable")
        json_data =  [cable.to_dict() for cable in cables]
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

    cable = Db.db_session.query(Cable).filter_by(id=plan_id).first()
    if cable is None:
        return jsonify({"status": "error", "message": "Invalid Id"}), 400

    try:
        cable.update(**{"status": status, "charges": charges})
    except:
        return jsonify({"status": "error", "message": "Update failed"}), 400
    return jsonify({"status": "success", "message": "Record updated successfully"}), 200


