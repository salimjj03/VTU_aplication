#!/usr/bin/env python3
"""

"""

from api.v1.views import app_view, api_view, network
from flask import request, jsonify, g
from modules.engine.db import Db
from modules.platform import Platform
from modules.airtime_type import AirtimeType
from modules.cable import Cable
from modules.bill import Bill
from modules.data_plan_name import DataPlanName
from modules.data_plan_type import DataPlanType
from modules.network import Network
from modules.user import User
from modules.transaction import Transaction
from modules.data_plan import DataPlan
from sqlalchemy.exc import IntegrityError
from modules.data_plan_size import DataPlanSize
from flask_jwt_extended import jwt_required
from sqlalchemy import and_, desc
import requests
import uuid
from datetime import datetime
from flask_jwt_extended import get_jwt_identity


@api_view.route("/", methods=["GET"], strict_slashes="False")
def api_home():
    """

    :return:
    """
    if not hasattr(g, "user"):
        return jsonify({"status": False, "message": "Unauthorized"}), 401
    return jsonify({"status": "Hi {}, welcome to Api View".format(g.user.user_name)})


@api_view.route("/data", methods=["POST"], strict_slashes="False")
def data():
    """

    :return:
    """
    if not hasattr(g, "user"):
        return jsonify({"status": False, "message": "Unauthorized"}), 401
    data = request.get_json()
    plan = Db.db_session.query(DataPlan).filter_by(id=data.get("plan_id")).first()

    if plan is None:
        return jsonify({
            "status": False,
            "message": "Plan not available"
        }), 400

    platform_id = plan.platform_id
    if platform_id is None:
        return jsonify({
            "status": False,
            "message": "Platform Id not available"
        }), 400

    platform = Db.db_session.query(Platform).filter_by(platform_id=platform_id).first()
    if platform is None:
        return jsonify({
            "status": False,
            "message": "Platform not available"
        }), 400

    if platform.platform_id == 1:
        try:
            user_name = g.user.user_name
            user = Db.db_session.query(User).filter_by(user_name=user_name).with_for_update().one()
            # user_price = plan.to_dict().get("user{}_price".format(user.type[-1]))
            # amount_before = user.balance
            channel_obj = Db.db_session.query(Network).filter_by(
                network_id=data.get("network_id")
            ).first()

            if len(str(data.get("phone"))) != 11:
                return jsonify({
                    "status": False,
                    "message": "Invalid Phone number"
                }), 400

            if data.get("validator") is False:
                code = str(data.get("phone"))[:4]
                if channel_obj.check_network_codes(code) is False:
                    return jsonify({
                        "status": False,
                        "message":  "Not an {} number".format(channel_obj.name)
                    }), 400

            bundle = plan.is_available_bundle(user)
            if bundle is not False:
                amount_before = bundle.get("before")
                user_price = bundle.get("size")
                new_balance = bundle.get("after")
                setattr(user, bundle.get("bundle"), new_balance)
            else:
                amount_before = user.balance
                user_price = plan.to_dict().get("user{}_price".format(user.type[-1]))
                if user.balance < user_price:
                    return jsonify({"status": "error", "message": "Insufficient Funds"}), 400
                else:
                    new_balance = user.balance - user_price
                    user.balance = new_balance

            channel = channel_obj.name

            plan_type_obj = Db.db_session.query(DataPlanType).filter_by(
                id=plan.plan_type
            ).first()
            plan_type = plan_type_obj.name

            api_data = {
                "network_id": str(plan.network_id),
                "phone": data.get("phone"),
                "plan_id": plan.plan_id
            }
            url = "https://www.sahrvtu.com/api/v1/data"
            headers = {
                "Authorization": "Bearer {}".format(platform.api_token),
                "Content-Type": "application/json"
            }
            res = requests.post(url=url,
                json=api_data,
                headers=headers,
                # timeout=180
                )
            if res is None:
                return jsonify({"status": False, "message": "Api Error"}), 502

            res_data = res.json()

            transaction = {
                "t_type": "DATA",
                "t_disc": "{} {} {} DATA to {}".format(
                    channel,
                    plan.plan_name,
                    plan_type,
                    data.get("phone")
                ),
                "t_date": datetime.utcnow(),
                "details": res_data.get("response").get("massage"),
                "user_name": user.user_name,
                "amount": user_price if bundle is False else "{} GB".format(user_price),
                "amount_before": amount_before if bundle is False else "{} GB".format(amount_before),
                "amount_after": new_balance if bundle is False else "{} GB".format(new_balance),
                "status": res_data.get("response").get("status"),
                "ref": res_data.get("reference"),
                "channel": channel,
                "platform": "API",
                "rtr": res_data.get("rtr")
            }

            if res_data.get("response").get("status") == "failed":

                if bundle is not False:
                    setattr(user, bundle.get("bundle"), bundle.get("before"))
                else:
                    user.balance = amount_before

                failed_transaction = Transaction(**transaction)
                failed_transaction.ref = str(uuid.uuid4())
                Db.db_session.add(failed_transaction)

                # refund_transaction = Transaction(**transaction)
                # refund_transaction.t_disc = "Refunded For Failed Data Purchase to {}".format(
                #     data.get("phone")
                # )
                # refund_transaction.ref = str(uuid.uuid4())
                # refund_transaction.amount_before = new_balance
                # refund_transaction.amount = user_price
                # refund_transaction.amount_after = amount_before
                # refund_transaction.status = "Success"
                # Db.db_session.add(refund_transaction)

            elif res_data.get("response").get("status") == "successful":
                successful_transaction = Transaction(**transaction)
                Db.db_session.add(successful_transaction)
                if user.ref_id:
                    ref_user = Db.db_session.query(User).filter(
                        and_(
                            User.user_name == user.ref_id,
                            User.suspended == "False"
                        )
                    ).first()
                    if ref_user:
                        ref_user.commission += plan.commission

                        ref_transaction = Transaction(**{
                            "t_disc": "COMMISSION EARNED FROM {} Transaction".format(user.user_name),
                            "channel": "COMMISSION",
                            "amount": plan.commission,
                            "amount_before": ref_user.commission - plan.commission,
                            "amount_after": ref_user.commission,
                            "user_name": ref_user.user_name,
                            "status": "successful",
                            "ref": str(uuid.uuid4()),
                            "rtr": "COMMISSION SUCCESSFULLY",
                            "t_type": "COMMISSION",
                            "t_date": datetime.utcnow()
                        })
                        Db.db_session.add(ref_transaction)

            Db.db_session.commit()
            if res_data.get("response").get("status") == "failed":
                return jsonify({"status": False, "message": res_data.get("desc")}), 501
            else:
                return jsonify({"status": True, "message": "Data purchase was successful"}), 200

        except requests.Timeout:
            return jsonify({"status": False, "message": "Request timed out after 15 seconds"}), 500

        except requests.ConnectionError:
            return jsonify({"status": False, "message": "Connection Error"}), 500

        except requests.JSONDecodeError:
            return jsonify({"status": False, "message": "Invalid Number"}), 400

        except:
            return jsonify({"status": False, "message": "Network Problem"}), 500

    elif platform.platform_id == 2:
        try:
            user_name = g.user.user_name
            user = Db.db_session.query(User).filter_by(user_name=user_name).with_for_update().one()
            user_price = plan.to_dict().get("user{}_price".format(user.type[-1]))
            amount_before = user.balance
            channel_obj = Db.db_session.query(Network).filter_by(
                network_id=data.get("network_id")
            ).first()

            if len(str(data.get("phone"))) != 11:
                return jsonify({
                    "status": False,
                    "message": "Invalid Phone number"
                }), 400

            if data.get("validator") is False:
                code = str(data.get("phone"))[:4]
                if channel_obj.check_network_codes(code) is False:
                    return jsonify({
                        "status": False,
                        "message": "Error, Not an {} number".format(channel_obj.name)
                    }), 400

            if user.balance < user_price:
                return jsonify({"status": False, "message": "Insufficient Funds"}), 400
            else:
                new_balance = user.balance - user_price
                user.balance = new_balance

            channel = channel_obj.name

            plan_type_obj = Db.db_session.query(DataPlanType).filter_by(
                id=plan.plan_type
            ).first()
            plan_type = plan_type_obj.name

            api_data = {
                "network_id": str(plan.network_id),
                "phone": data.get("phone"),
                "plan_id": plan.plan_id
            }
            url = "https://smeplug.ng/api/v1/data/purchase"
            headers = {
                "Authorization": "Bearer {}".format(platform.api_token),
                "Content-Type": "application/json"
            }
            res = requests.post(
                url=url,
                json=api_data,
                headers=headers,
                )
            if res is None:
                return jsonify({"status": False, "message": "Api Error"}), 502

            res_data = res.json()

            transaction = {
                "t_type": "DATA",
                "t_disc": "{} {} {} DATA to {}".format(
                    channel,
                    plan.plan_name,
                    plan_type,
                    data.get("phone")
                ),
                "t_date": datetime.utcnow(),
                "details": res_data.get("data").get("msg") if res_data.get("status") is not False else res_data.get("msg"),
                "user_name": user.user_name,
                "amount": user_price,
                "amount_before": amount_before,
                "amount_after": new_balance,
                "status": res_data.get("status"),
                "ref": res_data.get("reference"),
                "channel": channel,
                "platform": "API",
                "rtr": res_data.get("rtr")
            }

            if res_data.get("status") is False:

                user.balance = amount_before

                failed_transaction = Transaction(**transaction)
                failed_transaction.ref = str(uuid.uuid4())
                Db.db_session.add(failed_transaction)

                refund_transaction = Transaction(**transaction)
                refund_transaction.t_disc = "Refunded For Failed Data Purchase to {}".format(
                    data.get("phone")
                )
                refund_transaction.ref = str(uuid.uuid4())
                refund_transaction.amount_before = new_balance
                refund_transaction.amount = user_price
                refund_transaction.amount_after = amount_before
                refund_transaction.status = "Success"
                Db.db_session.add(refund_transaction)

            elif res_data.get("status") is True:
                successful_transaction = Transaction(**transaction)
                Db.db_session.add(successful_transaction)
                if user.ref_id:
                    ref_user = Db.db_session.query(User).filter(
                        and_(
                            User.user_name == user.ref_id,
                            User.suspended == "False"
                        )
                    ).first()
                    if ref_user:
                        ref_user.commission += plan.commission

                        ref_transaction = Transaction(**{
                            "t_disc": "COMMISSION EARNED FROM {} Transaction".format(user.user_name),
                            "channel": "COMMISSION",
                            "amount": plan.commission,
                            "amount_before": ref_user.commission - plan.commission,
                            "amount_after": ref_user.commission,
                            "user_name": ref_user.user_name,
                            "status": "successful",
                            "ref": str(uuid.uuid4()),
                            "rtr": "COMMISSION SUCCESSFULLY",
                            "t_type": "COMMISSION",
                            "t_date": datetime.utcnow()
                        })
                        Db.db_session.add(ref_transaction)

            Db.db_session.commit()
            if res_data.get("status") is False:
                return jsonify({"status": False, "message": res_data.get("msg")}), 501
            else:
                return jsonify({"status": True, "message": "Data purchase was successful"}), 200

        except requests.Timeout:
            return jsonify({"status": False, "message": "Request timed out after 15 seconds"}), 500

        except requests.ConnectionError:
            return jsonify({"status": False, "message": "Connection Error"}), 500

        except requests.JSONDecodeError:
            return jsonify({"status": False, "message": "Invalid Number"}), 400

    elif platform.platform_id == 3:
        try:
            user_name = g.user.user_name
            user = Db.db_session.query(User).filter_by(user_name=user_name).with_for_update().one()
            # user_price = plan.to_dict().get("user{}_price".format(user.type[-1]))
            # amount_before = user.balance
            channel_obj = Db.db_session.query(Network).filter_by(
                network_id=data.get("network_id")
            ).first()

            if len(str(data.get("phone"))) != 11:
                return jsonify({
                    "status": False,
                    "message": "Invalid Phone number"
                }), 400

            if data.get("validator") is False:
                code = str(data.get("phone"))[:4]
                if channel_obj.check_network_codes(code) is False:
                    return jsonify({
                        "status": False,
                        "message": "Not an {} number".format(channel_obj.name)
                    }), 400

            bundle = plan.is_available_bundle(user)
            if bundle is not False:
                amount_before = bundle.get("before")
                user_price = bundle.get("size")
                new_balance = bundle.get("after")
                setattr(user, bundle.get("bundle"), new_balance)
            else:
                amount_before = user.balance
                user_price = plan.to_dict().get("user{}_price".format(user.type[-1]))
                if user.balance < user_price:
                    return jsonify({"status": "error", "message": "Insufficient Funds"}), 400
                else:
                    new_balance = user.balance - user_price
                    user.balance = new_balance

            channel = channel_obj.name

            plan_type_obj = Db.db_session.query(DataPlanType).filter_by(
                id=plan.plan_type
            ).first()
            plan_type = plan_type_obj.name

            api_data = {
                "network_id": str(plan.network_id),
                "phone": data.get("phone"),
                "plan_id": plan.plan_id
            }
            url = "https://sphericalsubcld.com.ng/api/v1/data"
            headers = {
                "Authorization": "Bearer {}".format(platform.api_token),
                "Content-Type": "application/json"
            }
            res = requests.post(url=url,
                json=api_data,
                headers=headers,
                # timeout=180
                )
            if res is None:
                return jsonify({"status": False, "message": "Api Error"}), 502

            res_data = res.json()

            transaction = {
                "t_type": "DATA",
                "t_disc": "{} {} {} DATA to {}".format(
                    channel,
                    plan.plan_name,
                    plan_type,
                    data.get("phone")
                ),
                "t_date": datetime.utcnow(),
                "details": res_data.get("response").get("massage"),
                "user_name": user.user_name,
                "amount": user_price if bundle is False else "{} GB".format(user_price),
                "amount_before": amount_before if bundle is False else "{} GB".format(amount_before),
                "amount_after": new_balance if bundle is False else "{} GB".format(new_balance),
                "status": res_data.get("response").get("status"),
                "ref": res_data.get("reference"),
                "channel": channel,
                "platform": "API",
                "rtr": res_data.get("rtr")
            }

            if res_data.get("response").get("status") == "failed":

                if bundle is not False:
                    setattr(user, bundle.get("bundle"), bundle.get("before"))
                else:
                    user.balance = amount_before

                failed_transaction = Transaction(**transaction)
                failed_transaction.ref = str(uuid.uuid4())
                Db.db_session.add(failed_transaction)

                # refund_transaction = Transaction(**transaction)
                # refund_transaction.t_disc = "Refunded For Failed Data Purchase to {}".format(
                #     data.get("phone")
                # )
                # refund_transaction.ref = str(uuid.uuid4())
                # refund_transaction.amount_before = new_balance
                # refund_transaction.amount = user_price
                # refund_transaction.amount_after = amount_before
                # refund_transaction.status = "Success"
                # Db.db_session.add(refund_transaction)

            elif res_data.get("response").get("status") == "successful":
                successful_transaction = Transaction(**transaction)
                Db.db_session.add(successful_transaction)
                if user.ref_id:
                    ref_user = Db.db_session.query(User).filter(
                        and_(
                            User.user_name == user.ref_id,
                            User.suspended == "False"
                        )
                    ).first()
                    if ref_user:
                        ref_user.commission += plan.commission

                        ref_transaction = Transaction(**{
                            "t_disc": "COMMISSION EARNED FROM {} Transaction".format(user.user_name),
                            "channel": "COMMISSION",
                            "amount": plan.commission,
                            "amount_before": ref_user.commission - plan.commission,
                            "amount_after": ref_user.commission,
                            "user_name": ref_user.user_name,
                            "status": "successful",
                            "ref": str(uuid.uuid4()),
                            "rtr": "COMMISSION SUCCESSFULLY",
                            "t_type": "COMMISSION",
                            "t_date": datetime.utcnow()
                        })
                        Db.db_session.add(ref_transaction)

            Db.db_session.commit()
            if res_data.get("response").get("status") == "failed":
                return jsonify({"status": False, "message": res_data.get("desc")}), 501
            else:
                return jsonify({"status": True, "message": "Data purchase was successful"}), 200

        except requests.Timeout:
            return jsonify({"status": False, "message": "Request timed out after 15 seconds"}), 500

        except requests.ConnectionError:
            return jsonify({"status": False, "message": "Connection Error"}), 500

        except requests.JSONDecodeError:
            return jsonify({"status": False, "message": "Invalid Number"}), 400


@api_view.route("/airtime", methods=["POST"], strict_slashes="False")
def airtime():
    """

    :return:
    """
    if not hasattr(g, "user"):
        return jsonify({"status": False, "message": "Unauthorized"}), 401

    platform = Db.db_session.query(Platform).filter_by(platform_id=1).first()
    if platform is None:
        return jsonify({
            "status": False,
            "message": "Invalid platform Id"
        }), 400

    data = request.get_json()

    try:
        user_name = g.user.user_name
        user = Db.db_session.query(User).filter_by(user_name=user_name).with_for_update().one()
        balance = user.balance
        if balance < int(data.get("amount")):
            return jsonify({"status": False, "message": "Insufficient Funds"}), 400

        if int(data.get("amount")) < 10:
            return jsonify({"status": False, "message": "Amount is too low"}), 400

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
            # timeout=180
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
            return jsonify({"status": True, "message": "Airtime purchase was successful"}), 200
        else:
            print(response)
            return jsonify({"status": False, "message": response.get("response").get("message")}), 501
    except requests.Timeout:
        return jsonify({"status": False, "message": "Request timed out after 120 seconds"}), 503

    except requests.ConnectionError:
        return jsonify({"status": False, "message": "Connection Error"}), 503


@api_view.route("/cable", methods=["POST"], strict_slashes="False")
def cable():
    """

    :return:
    """

    if not hasattr(g, "user"):
        return jsonify({"status": False, "message": "Unauthorized"}), 401

    platform = Db.db_session.query(Platform).filter_by(platform_id=1).first()
    if platform is None:
        return jsonify({
            "status": False,
            "message": "Error,  Invalid platform Id"
        }), 400

    if request.method == "POST":
        data = request.get_json()
        card_number = data.get("cardNumber")
        plan_id = data.get("planId")

        if card_number is None:
            return jsonify({
                "status": False,
                "message": "card number is empty"
            }), 400

        if plan_id is None:
            return jsonify({
                "status": False,
                "message": "plan id is empty"
            }), 400

        select_cable = Db.db_session.query(Cable).filter_by(id=plan_id).first()
        amount = int(select_cable.amount)

        try:
            user_name = g.user.user_name
            user = Db.db_session.query(User).filter_by(user_name=user_name).with_for_update().one()
            balance = user.balance
            if balance < amount:
                return jsonify({"status": False, "message": "Insufficient Funds"}), 400

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
                return jsonify({"status": True, "message": "Cable subscription was successful"}), 200
            else:
                return jsonify({"status": False, "message": "Transaction failed"}), 501
        except requests.Timeout:
            return jsonify({"status": False, "message": "Request timed out after 120 seconds"}), 503

        except requests.ConnectionError:
            return jsonify({"status": False, "message": "Connection Error"}), 503

    user_name = get_jwt_identity()
    user = Db.db_session.query(User).filter_by(user_name=user_name).first()
    cables = {"gotv": [], "dstv": [], "startime": []}

    data = Db.db_session.query(Cable).all()
    for c in data:
        if c.decoder_id == "1":
            cables["gotv"].append(c.to_dict())
        elif c.decoder_id == "2":
            cables["dstv"].append(c.to_dict())
        elif c.decoder_id == "3":
            cables["startime"].append(c.to_dict())
    return jsonify({"cables": cables, "balance": user.balance})


@api_view.route("/cable_validation", methods=["POST"], strict_slashes="False")
def cable_validation():
    """

    """

    if not hasattr(g, "user"):
        return jsonify({"status": False, "message": "Unauthorized"}), 401

    platform = Db.db_session.query(Platform).filter_by(platform_id=1).first()
    if platform is None:
        return jsonify({
            "status": False,
            "message": "Error,  Invalid platform Id"
        }), 400

    data = request.get_json()

    card_number = data.get("cardNumber")
    plan_id = data.get("planId")

    if card_number is None:
        return jsonify({
            "status": False,
            "message": "card number is empty"
        }), 400

    if plan_id is None:
        return jsonify({
            "status": False,
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
            "status": False,
            "message": "Network problem"
        }), 400
    return jsonify(res.json()), 200


@api_view.route("/electricity", methods=["POST"], strict_slashes="False")
def electricity():
    """

    :return:
    """

    if not hasattr(g, "user"):
        return jsonify({"status": False, "message": "Unauthorized"}), 4010

    platform = Db.db_session.query(Platform).filter_by(platform_id=1).first()
    if platform is None:
        return jsonify({
            "status": False,
            "message": "Invalid platform Id"
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
                "status": False,
                "message": "Meter number is empty"
            })

        if planId is None:
            return jsonify({
                "status": False,
                "message": "plan id is empty"
            })

        if amount is None:
            return jsonify({
                "status": False,
                "message": "amount is empty"
            })

        if name is None:
            return jsonify({
                "status": False,
                "message": "name is empty"
            })

        if address is None:
            return jsonify({
                "status": False,
                "message": "address is empty"
            })

        select_bill = Db.db_session.query(Bill).filter_by(id=planId).first()
        amount = int(amount)

        if amount < 500:
            return jsonify({
                "status": False,
                "message": "Amount is too low"
            })

        try:
            user_name = g.user.user_name
            user = Db.db_session.query(User).filter_by(user_name=user_name).with_for_update().one()
            balance = user.balance
            if balance < amount:
                return jsonify({"status": False, "message": "Insufficient Funds"}), 400

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
                "details": "failed" if response.get("status") == False else "Success",
                "status": "successful" if response.get("status") == True else "failed",
                "rtr": response.get("token") if response.get("status") is True else None
            }
            new_transaction = Transaction(**transaction)
            Db.db_session.add(new_transaction)
            Db.db_session.commit()

            if response.get("status") is True:
                return jsonify({"status": True, "message": response.get("token")}), 200
            else:
                return jsonify({"status": False, "message": "Transaction failed"}), 501
        except requests.Timeout:
            return jsonify({"status": False, "message": "Request timed out after 120 seconds"}), 503

        except requests.ConnectionError:
            return jsonify({"status": False, "message": "Connection Error"}), 503



@api_view.route("/electricity_validation", methods=["POST"], strict_slashes="False")
def electricity_validation():
    """

    """

    if not hasattr(g, "user"):
        return jsonify({"status": False, "message": "Unauthorized"}), 401

    platform = Db.db_session.query(Platform).filter_by(platform_id=1).first()
    if platform is None:
        return jsonify({
            "status": False,
            "message": "Error,  Invalid platform Id"
        }), 400

    data = request.get_json()

    meterNumber = data.get("meterNumber")
    planId = data.get("planId")

    if meterNumber is None:
        return jsonify({
            "status": False,
            "message": "Meter number is empty"
        })

    if planId is None:
        return jsonify({
            "status": False,
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
        res = requests.post(
            url=url,
            json=api_data,
            headers=headers,
            # timeout=180
            )
    except:
        return jsonify({
            "status": False,
            "message": "Network problem"
        })
    return jsonify(res.json())
