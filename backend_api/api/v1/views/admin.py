#!/usr/bin/env python3
"""

"""

from api.v1.views import app_view, transactions, balance
from flask import request, jsonify
from modules.user import User
from modules.admin import Admin
from modules.transaction import Transaction
from modules.notifications import Notification
from modules.platform import Platform
from modules.engine.db import Db
from datetime import datetime
import uuid
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import desc
import requests



@app_view.route("/funding", methods=["POST"], strict_slashes=False)
@jwt_required()
def funding():
    """

    :return:
    """

    if Admin.role_validation("admin") is False:
        return jsonify({"status": "error", "message": "not allowed"}), 401

    if request.method == "POST":
        data = request.get_json()
        if data is None or data == "":
            return jsonify({"status": "error", "message": "Empty Form"}), 400

        user_name = data.get("user_name")
        user = Db.db_session.query(User).filter_by(user_name=user_name).first()
        if user is None:
            return jsonify({"status": "error", "message": "Invalid user name"}), 400

        amount = data.get("amount")
        type = data.get("type")
        if type == "bundle":
            bundle_type = data.get("bundle")
            balance = user.to_dict().get(bundle_type)
            if data.get("method") == "fund":
                new_balance = balance + float(amount)
                setattr(user, data.get("bundle"), new_balance)
            else:
                new_balance = balance - float(amount)
                setattr(user, data.get("bundle"), new_balance)
        elif type == "wallet":
            balance = user.balance
            if data.get("method") == "fund":
                new_balance = balance + int(data.get("amount"))
            elif data.get("method") == "deduct":
                new_balance = balance - int(data.get("amount"))
            user.update(**{"balance": new_balance})
        # try:

        transaction = {
            "t_type": data.get("method").upper(),
            "t_disc": "MANUAL WALLET FUNDING",
            "t_date": datetime.utcnow(),
            "details": "successful",
            "user_name": user_name,
            "amount": amount if type == "wallet" else "{} GB".format(amount),
            "amount_before": balance if type == "wallet" else "{} GB".format(balance),
            "amount_after": new_balance if type == "wallet" else "{} GB".format(new_balance),
            "status": "successful",
            "ref": str(uuid.uuid4()),
            "channel": data.get("method").upper(),
            "platform": None,
            "rtr": "Manual Funding was successful"
        }

        fund_transaction = Transaction(**transaction)
        Db.db_session.add(fund_transaction)
        Db.db_session.commit()
        return jsonify({
            "status": "success",
            "message": "{} was successful".format(data.get("method"))
        }), 201

@app_view.route("/notification", methods=["POST", "GET"], strict_slashes=False)
@app_view.route("/notification/<notification_id>", methods=["DELETE"], strict_slashes=False)
@jwt_required()
def notification(notification_id=None):
    """

    """


    user_name = get_jwt_identity()
    user = Db.db_session.query(Admin).filter_by(user_name=user_name).first()
    if user is None:
        return jsonify({"status": "error", "message": "Un authorize"})
    if request.method == "POST":
        if Admin.role_validation("admin") is False:
            return jsonify({"status": "error", "message": "not allowed"}), 401
        data = request.get_json()
        new_notification = Notification(**data)
        Db.db_session.add(new_notification)
        Db.db_session.commit()
        return jsonify({"status": "success", "message": "Notification added successfully"})


    if request.method == "GET":
        notifications = Db.db_session.query(Notification).order_by(desc(Notification.created_at))
        notifications_dict = [ n.to_dict() for n in notifications ]
        return jsonify(notifications_dict), 200

    if request.method == "DELETE":
        notification = Db.db_session.query(Notification).filter_by(id=notification_id).first()
        notification.delete()
        return jsonify({"message": "Record deleted successfully", "status": "success"})
        
        
@app_view.route("/password_reset", methods={"PUT"}, strict_slashes=False)
@jwt_required()
def password_reset():
    """

    :return:
    """


    if request.method == "PUT":
        data = request.get_json()
        if data is None or data == "":
            return jsonify({"status": "error", "message": "empty Form"}), 400

        user_name = get_jwt_identity()
        user = Db.db_session.query(Admin).filter_by(user_name=user_name).first()
        if data.get("password") != "" and data.get("password") is not None:
            data["password"] = user.encrypt_password(data.get("password"))
            #return jsonify({"status": "success", "message": data.get("password")})
        try:
            user.update(**data)
            return jsonify({"status": "success", "message": "Record updated successfully"}), 201
        except:
            return jsonify({"status": "error", "message": "Server error"}), 500


@app_view.route("/platform", methods={"GET", "PUT", "POST"}, strict_slashes=False)
@jwt_required()
def platform():

    if request.method == "GET":
        platforms = Db.all("Platform")
        dic = [p.to_dict() for p in platforms]
        return jsonify(dic)


@app_view.route("/admin_dashboard_data", methods=["GET"], strict_slashes=False)
@jwt_required()
def admin_dashboard_data():
    """

    :return:
    """

    if Admin.role_validation("admin") is False:
        return jsonify({"status": "error", "message": "not allowed"}), 401
    if request.method == "GET":
        all_user = Db.all("User")
        transactions_data = Db.all("Transaction")
        transactions_dict = [t.to_dict() for t in transactions_data]
        users = []
        bundle_summary = {
            "mtn_sme_bundle": 0,
            "mtn_cg_bundle": 0,
            "airtel_cg_bundle": 0,
            "glo_cg_bundle": 0,
            "mobile_cg_bundle": 0
        }
        platform_data = Db.db_session.query(Platform).filter_by(platform_id=1).first()
        api_token = platform_data.to_dict().get("api_token") if platform_data is not None else None
        for u in all_user:
            users.append({"balance": u.balance, "suspended": u.suspended})
            bundle_summary["mtn_sme_bundle"] += u.mtn_sme_bundle
            bundle_summary["mtn_cg_bundle"] += u.mtn_cg_bundle
            bundle_summary["airtel_cg_bundle"] += u.airtel_cg_bundle
            bundle_summary["glo_cg_bundle"] += u.glo_cg_bundle
            bundle_summary["mobile_cg_bundle"] += u.mobile_cg_bundle
        api_user = None
        if api_token is not None:
            url = "https://sahrvtu.com/api/v1/user_dashboard"
            headers = { 'Authorization': "Bearer {}".format(api_token)}
            try:
                res = requests.get(
                    url,
                    headers=headers
                )
                if res.status_code == 200:
                    api_user = res.json()
            except:
                pass
        result = {
            "transactions": transactions_dict,
            "users": users,
            "api_user": api_user,
            "bundle_summary": bundle_summary
        }
        return jsonify(result)