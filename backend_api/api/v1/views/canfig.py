#!/usr/bin/env python3
"""

"""

from api.v1.views import app_view, network
from flask import request, jsonify
from modules.engine.db import Db
from modules.user import User
from modules.config import Config
from modules.transaction import Transaction
from modules.cable import Cable
from flask_jwt_extended import jwt_required
from sqlalchemy import and_, desc
import requests
import uuid
from datetime import datetime
from flask_jwt_extended import get_jwt_identity
import json


@app_view.route("/site_info", methods=["POST", "GET"], strict_slashes="False")
@jwt_required()
def site_info():
    """

    :return:
    """

    if Config.role_validation("admin") is False:
        return jsonify({"status": "error", "message": "not allowed"}), 401

    if request.method == "POST":
        data = request.get_json()
        if data is None:
            return jsonify({"status": "error", "message": "Form is empty"}), 402
        info = Db.db_session.query(Config).first()
        if info is None:
            config = Config(**data)
            Db.db_session.add(config)
            Db.db_session.commit()
            return jsonify({"status": "success", "message": "Record added successfully"}), 200
        else:
            info.update(**data)
            return jsonify({"status": "success", "message": "Record Updated successfully"}), 200

    info = Db.db_session.query(Config).first()

    return jsonify(info.to_dict() if info is not None else None), 200


@app_view.route("/bank", methods=["POST"], strict_slashes="False")
@jwt_required()
def bank():
    """

    """

    if Config.role_validation("admin") is False:
        return jsonify({"status": "error", "message": "not allowed"}), 401

    if request.method == "POST":
        data = request.get_json()
        if data is None:
            return jsonify({"status": "error", "message": "Form is empty"}), 402

        if data.get("account_name") is None or data.get("account_name") == "":
            return jsonify({"status": "error", "message": "Account name missing"}), 402

        if data.get("account_no") is None or data.get("account_no") == "":
            return jsonify({"status": "error", "message": "Account number missing"}), 402

        if data.get("bank_name") is None or data.get("bank_name") == "":
            return jsonify({"status": "error", "message": "bank_name missing"}), 402

        account = {
            "bank_name": data.get("bank_name"),
            "account_name": data.get("account_name"),
            "account_no": data.get("account_no")
        }

        info = Db.db_session.query(Config).first()
        if info is None:
            config = Config(**{
                "account": json.dumps(account),
                "nin": data.get("nin"),
                "bvn": data.get("bvn")
            })
            Db.db_session.add(config)
            Db.db_session.commit()
            return jsonify({"status": "success", "message": "Record added successfully"}), 200
        else:
            info.update(**{
                "account": json.dumps(account),
                "nin": data.get("nin"),
                "bvn": data.get("bvn")
            })
            return jsonify({"status": "success", "message": "Record Updated successfully"}), 200


@app_view.route("/payment_point_config", methods=["POST"], strict_slashes="False")
@jwt_required()
def payment_point_config():
    """

    """

    if Config.role_validation("admin") is False:
        return jsonify({"status": "error", "message": "not allowed"}), 401

    if request.method == "POST":
        data = request.get_json()
        if data is None:
            return jsonify({"status": "error", "message": "Form is empty"}), 402

        if data.get("api_key") is None or data.get("api_key") == "":
            return jsonify({"status": "error", "message": "api_key missing"}), 402

        if data.get("secret_key") is None or data.get("secret_key") == "":
            return jsonify({"status": "error", "message": "secret_key missing"}), 402

        if data.get("business_id") is None or data.get("business_id") == "":
            return jsonify({"status": "error", "message": "business_id missing"}), 402

        paymentPointInfo = {
            "api_key": data.get("api_key"),
            "secret_key": data.get("secret_key"),
            "business_id": data.get("business_id")
        }

        Config.set_payment_point(paymentPointInfo)
        return jsonify({"status": "success", "message": "Record added successfully"}), 200


@app_view.route("/monnify_config", methods=["POST"], strict_slashes="False")
@jwt_required()
def monnify_config():
    """

    """

    if Config.role_validation("admin") is False:
        return jsonify({"status": "error", "message": "not allowed"}), 401

    if request.method == "POST":
        data = request.get_json()
        if data is None:
            return jsonify({"status": "error", "message": "Form is empty"}), 402

        if data.get("api_key") is None or data.get("api_key") == "":
            return jsonify({"status": "error", "message": "api_key missing"}), 402

        if data.get("secret_key") is None or data.get("secret_key") == "":
            return jsonify({"status": "error", "message": "secret_key missing"}), 402

        if data.get("contract_code") is None or data.get("contract_code") == "":
            return jsonify({"status": "error", "message": "contract_code"}), 402

        monnifyInfo = {
            "api_key": data.get("api_key"),
            "secret_key": data.get("secret_key"),
            "contract_code": data.get("contract_code")
        }

        Config.set_monnify(monnifyInfo)
        return jsonify({"status": "success", "message": "Record added successfully"}), 200


