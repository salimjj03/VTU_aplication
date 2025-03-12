#!/usr/bin/env python3
"""

"""

from api.v1.views import app_view
from flask import jsonify, request
from modules.user import User
from modules.transaction import Transaction
from modules.config import Config
from modules.engine.db import Db
from flask_jwt_extended import jwt_required, get_jwt_identity
import uuid
from sqlalchemy import desc
from modules.notifications import Notification

@app_view.route("/full_name/<user_name>", methods=["GET"], strict_slashes="False")
@jwt_required()
def full_name(user_name=None):
    """

    :return:
    """

    if user_name is None:
        return jsonify({"status": "error", "message": "User name is empty"}), 400

    user = Db.db_session.query(User).filter_by(user_name=user_name).first()
    if user is None:
        return jsonify({"status": "error", "message": "Invalid User Name"}), 402
    return jsonify({"full_name": user.to_dict().get("full_name")}), 200

@app_view.route("/user", methods=["GET"], strict_slashes="False")
@app_view.route("/user/<user_id>", methods=["GET"], strict_slashes="False")
@jwt_required()
def user(user_id=None):
    """

    :return:
    """

    if user_id is None:
        user_name = get_jwt_identity()
        user = Db.db_session.query(User).filter_by(user_name=user_name).first()
        return jsonify(user.to_dict()), 200

    user = Db.db_session.query(User).filter_by(id=user_id).first()
    return jsonify(user.to_dict()), 200


@app_view.route("/add_user", methods=["POST"], strict_slashes="False")
def add_user():
    """

    :return:
    """

    data = request.get_json()
    if data is None:
        return jsonify({"status": "error", "message": "Empty form"}), 400

    if data.get("full_name") is None or data.get("full_name") == "":
        return jsonify({"status": "error", "message": "Enter Full Name"}), 400

    if data.get("user_name") is None or data.get("user_name") == "":
        return jsonify({"status": "error", "message": "Enter User Name"}), 400

    if Db.db_session.query(User).filter_by(user_name=data.get("user_name")).first() is not None:
        return jsonify({"status": "error", "message": "User Name Exist"}), 400

    if data.get("email") is None or data.get("email") == "":
        return jsonify({"status": "error", "message": "Enter Email"}), 400

    if Db.db_session.query(User).filter_by(email=data.get("email")).first() is not None:
        return jsonify({"status": "error", "message": "Email Exist"}), 400

    if data.get("phone_no") is None or data.get("phone_no") == "":
        return jsonify({"status": "error", "message": "Enter Phone No"}), 400

    if Db.db_session.query(User).filter_by(phone_no=data.get("phone_no")).first() is not None:
        return jsonify({"status": "error", "message": "Phone Number Exist"}), 400

    if data.get("ref_id") != "" and data.get("ref_id") is not None:
        if Db.db_session.query(User).filter_by(user_name=data.get("ref_id")).first() is None:
            return jsonify({"status": "error", "message": "Invalid Referral ID"}), 400

    if data.get("password") is None:
        return jsonify({"status": "error", "message": "Enter New Password"}), 400

    new_user = User(**data)
    if data.get("ref_id") == "":
        new_user.ref_id = None
    new_user.save()

    return jsonify({
        "status": "success",
        "message": "{} Account Created Successfully".format(data.get("user_name")),
    }), 201


@app_view.route("/users", methods={"GET", "PUT"}, strict_slashes=False)
@app_view.route("/users/<user_id>", methods={"DELETE"}, strict_slashes=False)
@jwt_required()
def users(user_id=None):
    """

    :return:
    """

    

    if request.method == "GET":
        if User.role_validation("admin") is not True:
            return jsonify({"status": "error", "message": "Unauthorized"}), 400
        users = Db.db_session.query(User).all()
        json_data = [u.to_dict() for u in users]
        return jsonify(json_data), 200


    if request.method == "PUT":
        data = request.get_json()
        if data is None or data == "":
            return jsonify({"status": "error", "message": "empty Form"}), 400

        user_name = data.get("user_name")
        if user_name is None:
            user_name = get_jwt_identity()
        user = Db.db_session.query(User).filter_by(user_name=user_name).first()
        if data.get("password") != "" and data.get("password") is not None:
            data["password"] = user.encrypt_password(data.get("password"))
            #return jsonify({"status": "success", "message": data.get("password")})
        try:
            user.update(**data)
            return jsonify({"status": "success", "message": "Record updated successfully"}), 201
        except:
            return jsonify({"status": "error", "message": "Server error"}), 500

    if request.method == "DELETE":
        data = user_id
        if data is None or data == "":
            return jsonify({"status": "error", "message": "empty Form"}), 400

        user_id = data
        user = Db.db_session.query(User).filter_by(id=user_id).first()
        try:
            user.delete()
            return jsonify({"status": "success", "message": "Record Deleted successfully"})
        except:
            return jsonify({"status": "error", "message": "Server error"}), 500


@app_view.route("/reserve_accounts/<user_id>", methods=["POST"], strict_slashes=False)
@jwt_required()
def reserve_accounts(user_id=None):
    """

    :return:
    """

    if user_id is None:
        return jsonify({"status": "error", "message": "Id is empty"}), 400

    user = Db.db_session.query(User).filter_by(id=user_id).first()

    if user is None:
        return jsonify({"status": "error", "message": "Invalid User Name"}), 400

    try:
        res = user.account_reserve()
        if res.json.get("status") == "error":
            return jsonify({"status": "error", "message": res.json.get("message")}), 400
        elif res.json.get("status") == "success":
            return jsonify({
                "status": "success",
                "message": res.json.get("message"),
                "accounts": res.json.get("accounts")
            }), 200

    except:
        return jsonify({"status": "error", "message": "Server error"}), 500


@app_view.route("/send_money", methods=["POST"], strict_slashes=False)
@jwt_required()
def send_money():
    """

    :return:
    """

    if request.method == "POST":
        data = request.get_json()
        if data is None or data == "":
            return jsonify({"status": "error", "message": "empty Form"}), 400

        if data.get("sender") == data.get("user_name"):
            return jsonify({"status": "error", "message": "You can't Transfer to your self"}), 400

        sender = Db.db_session.query(User).filter_by(user_name=data.get("sender")).first()

        if int(data.get("amount")) < 1:
            return jsonify({"status": "error", "message": "Invalid Amount"}), 400

        if sender.balance < int(data.get("amount")):
            return jsonify({"status": "error", "message": "Insufficient Fund"}), 400

        user_name = data.get("user_name")
        user = Db.db_session.query(User).filter_by(user_name=user_name).first()
        if user is None:
            return jsonify({"status": "error", "message": "invalid user name"}), 400
        balance = user.balance
        sender_balance = sender.balance

        new_balance = user.balance + int(data.get("amount"))
        sender_new_balance = sender.balance - int(data.get("amount"))

        sender.update(**{"balance": sender_new_balance})
        debit = {
            "t_type": "Debit",
            "t_disc": "DEBIT FOR Transfer To {}".format(user.user_name),
            "user_name": sender.user_name,
            "amount": data.get("amount"),
            "amount_before": sender_balance,
            "amount_after": sender_new_balance,
            "status": "successful",
            "ref": str(uuid.uuid4()),
            "channel": "Transfer",
            "platform": None,
            "rtr": "User Transfer was successful"
        }
        try:
            user.update(**{"balance": new_balance})
            credit = {
                "t_type": "Transfer",
                "t_disc": "CREDIT FROM {}".format(sender.user_name),
                "user_name": user_name,
                "amount": data.get("amount"),
                "amount_before": balance,
                "amount_after": new_balance,
                "status": "successful",
                "ref": str(uuid.uuid4()),
                "channel": "Transfer",
                "platform": None,
                "rtr": "Transfer was successful"
            }

            credit_transaction = Transaction(**credit)
            Db.db_session.add(credit_transaction)

            debit_transaction = Transaction(**debit)
            Db.db_session.add(debit_transaction)

            Db.db_session.commit()
            return jsonify({
                "status": "success",
                "message": "Transfer was successful"
            }), 201
        except:
            return jsonify({"status": "error", "message": "Server Error"}), 500

@app_view.route("/balance", strict_slashes=False)
@jwt_required()
def balance():
    """

    :return:
    """

    user_name = get_jwt_identity()
    user = Db.db_session.query(User).filter_by(user_name=user_name).first()
    user_balance = user.balance

    return jsonify({"balance": user_balance}), 200


@app_view.route("/commission", methods=["POST"], strict_slashes=False)
@jwt_required()
def commission():
    """

    """

    user_name =  get_jwt_identity()
    user = Db.db_session.query(User).filter_by(user_name=user_name).first()
    if user.commission > 0:
        user.balance += user.commission
        user.commission = 0
        Db.db_session.commit()
        return jsonify({
            "status": "success", "message": "Commission withdraw successfully"
        }), 200

    return jsonify({
        "status": "error", "message": "You don't have available commission to withdraw"
    })

@app_view.route("/dashboard_data", strict_slashes=False)
@jwt_required()
def dashboard_data():
    """

    """

    user_name = get_jwt_identity()
    user = Db.db_session.query(User).filter_by(user_name=user_name).first()
    transactions = Db.db_session.query(Transaction).filter_by(user_name=user_name).order_by(desc(Transaction.t_date))
    notifications = Db.db_session.query(Notification).order_by(desc(Notification.created_at))
    
    

    ref = Db.db_session.query(User.ref_id).filter_by(ref_id=user_name).all()
    config = Db.db_session.query(Config).first()
    if config is None:
        info = {}
    else:
        config_dict = config.to_dict()
        info = {
            "address": config_dict.get("address"),
            "phone": config_dict.get("phone"),
            "email": config_dict.get("email"),
            "whatsapp": config_dict.get("whatsapp"),
            "whatsapp_group": config_dict.get("whatsapp_group"),
            "site_name": config_dict.get("site_name")
        }

    data = {
        "ref": len(ref),
        "user": user.to_dict(),
        "transactions": [t.to_dict() for t in transactions],
        "notifications": [n.to_dict() for n in notifications],
        "info": info
    }
    return jsonify(data), 200


@app_view.route("/bundle", methods=["GET", "POST"], strict_slashes=False)
@jwt_required()
def bundle():
    """

    """

    user_name = get_jwt_identity()
    user = Db.db_session.query(User).filter_by(user_name=user_name).first()
    return jsonify({"bundles": user.bundles()}), 200


