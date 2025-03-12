#!/usr/bin/env python3
"""

"""

from api.v1.views import app_view, network
from flask import request, jsonify
from modules.engine.db import Db
from modules.data_plan_name import DataPlanName
from modules.data_plan_type import DataPlanType
from modules.network import Network
from modules.user import User
from modules.config import Config
from modules.transaction import Transaction
from modules.data_plan import DataPlan
from modules.platform import Platform
from sqlalchemy.exc import IntegrityError
from modules.data_plan_size import DataPlanSize
from flask_jwt_extended import jwt_required
from sqlalchemy import and_, desc
import requests
import uuid
from datetime import datetime
from flask_jwt_extended import get_jwt_identity
from modules.data_paln_id import DataPlanId


@app_view.route("/add_plan_name", methods=["POST", "GET"], strict_slashes="False")
@app_view.route("/add_plan_name/<plan_id>", methods=["DELETE"], strict_slashes="False")
@jwt_required()
def add_plan_name(plan_id=None):
    """

    :return:
    """

    if request.method == "GET":
        plan_name = Db.all("DataPlanName")
        result = [s.to_dict() for s in plan_name]
        return jsonify(result), 200

    if request.method == "DELETE":

        if DataPlan.role_validation("admin") is False:
            return jsonify({"status": "error", "message": "not allowed"}), 401

        type_id = plan_id
        if type_id is None or type_id == "":
            return jsonify({"status": "error", "message": "Id is empty"}), 400
        plan_size = Db.db_session.query(DataPlanName).filter_by(id=type_id).first()
        if plan_size is None:
            return jsonify({"status": "error", "message": "Invalid Id"}), 400

        try:
            plan_size.delete()
            return jsonify({"status": "success", "message": "Record delete Successfully"}), 200

        except IntegrityError:
            return jsonify({"status": "success", "message": "Error, ForeignKey constraint"}), 500

        except:
            return jsonify({"status": "success", "message": "Server Error"}), 500

    if DataPlan.role_validation("admin") is False:
        return jsonify({"status": "error", "message": "not allowed"}), 401

    data = request.get_json()
    if data is None:
        return jsonify({"status": "error", "message": "Form is empty"}), 400

    if "name" not in data:
        return jsonify({"status": "error", "message": "Name is Empty"}), 400

    if Db.db_session.query(DataPlanName).filter_by(name=data.get("name")).first() is not None:
        return jsonify({"status": "error", "message": "Name Exist"}), 400

    try:
        new_plan_name = DataPlanName(**data)
        new_plan_name.save()
        return jsonify({"status": "success", "message": "New Data Name Added Successfully"}), 201
    except Exception:
        return jsonify({"status": "error", "message": "Server Error, Can't add Plan name"}), 500


@app_view.route("/add_plan_size", methods=["POST", "GET"], strict_slashes="False")
@app_view.route("/add_plan_size/<size_id>", methods=["DELETE"], strict_slashes="False")
@jwt_required()
def add_plan_size(size_id=None):
    """

    :return:
    """

    if request.method == "GET":
        plan_size = Db.all("DataPlanSize")
        result = [s.to_dict() for s in plan_size]
        return jsonify(result), 200


    if request.method == "DELETE":
        if DataPlan.role_validation("admin") is False:
            return jsonify({"status": "error", "message": "not allowed"}), 401

        type_id = size_id
        if type_id is None or type_id == "":
            return jsonify({"status": "error", "message": "Id is empty"}), 401
        plan_size = Db.db_session.query(DataPlanSize).filter_by(id=type_id).first()
        if plan_size is None:
            return jsonify({"status": "error", "message": "Invalid Id"}), 401

        try:
            plan_size.delete()
            return jsonify({"status": "success", "message": "Record delete Successfully"}), 200

        except IntegrityError:
            return jsonify({"status": "success", "message": "Error, ForeignKey constraint"}), 500

        except:
            return jsonify({"status": "success", "message": "Server Error"}), 500

    if DataPlan.role_validation("admin") is False:
        return jsonify({"status": "error", "message": "not allowed"}), 401

    data = request.get_json()
    if data is None:
        return jsonify({"status": "error", "message": "Form is empty"}), 400

    if "name" not in data:
        return jsonify({"status": "error", "message": "Name is Empty"}), 400

    if Db.db_session.query(DataPlanSize).filter_by(name=data.get("name")).first() is not None:
        return jsonify({"status": "error", "message": "Name Exist"}), 400

    try:
        new_plan_size = DataPlanSize(**data)
        new_plan_size.save()
        return jsonify({"status": "success", "message": "New Data Size Added Successfully"}), 201
    except Exception:
        return jsonify({"status": "error", "message": "Server Error, Can't add Plan Size"}), 500


@app_view.route("/add_plan_type", methods=["GET", "POST"], strict_slashes="False")
@app_view.route("/add_plan_type/<type_id>", methods=["DELETE"], strict_slashes="False")
@jwt_required()
def add_plan_type(type_id=None):
    """

    :return:
    """

    if request.method == "GET":
        plan_types = Db.db_session.query(DataPlanType).order_by(
            desc(DataPlanType.name)).all() if DataPlan.role_validation("admin") else Db.db_session.query(
            DataPlanType).filter_by(status="on").order_by(desc(DataPlanType.name)).all()
        result = [t.to_dict() for t in plan_types]
        return jsonify(result), 200


    if request.method == "DELETE":
        if DataPlan.role_validation("admin") is False:
            return jsonify({"status": "error", "message": "not allowed"}), 401

        type_id = type_id
        if type_id is None or type_id == "":
            return jsonify({"status": "error", "message": "Id is empty"}), 400
        plan_type = Db.db_session.query(DataPlanType).filter_by(id=type_id).first()
        if plan_type is None:
            return jsonify({"status": "error", "message": "Invalid Id"}), 400

        try:
            plan_type.delete()
            return jsonify({"status": "success", "message": "Record delete Successfully"}), 200

        except IntegrityError:
            return jsonify({"status": "success", "message": "Error, ForeignKey constraint"}), 500

        except:
            return jsonify({"status": "success", "message": "Server Error"}), 500

    if DataPlan.role_validation("admin") is False:
        return jsonify({"status": "error", "message": "not allowed"}), 401
    data = request.get_json()
    if data is None:
        return jsonify({"status": "error", "message": "Form is empty"}), 400

    if "name" not in data:
        return jsonify({"status": "error", "message": "Name is Empty"}), 400

    if Db.db_session.query(DataPlanType).filter_by(
            name=data.get("name"),
            network_id=data.get("network_id")).first() is not None:
        return jsonify({"status": "error", "message": "Type Exist"}), 400
    try:
        new_plan_type = DataPlanType(**data)
        new_plan_type.save()
        return jsonify({"status": "success", "message": "New Data Type Added Successfully"}), 201
    except Exception:
        return jsonify({"status": "error", "message": "Server Error, Can't add Plan type"}), 500


@app_view.route("/plan_type_by_id/<network_id>", methods=["GET"], strict_slashes="False")
@jwt_required()
def plan_type_by_id(network_id):
    """
s_
    :return:
    """

    types = Db.db_session.query(DataPlanType).filter(
        and_(
            DataPlanType.network_id == network_id,
            DataPlanType.status != "off"
        )
    ).all()
    result = [t.to_dict() for t in types]
    return jsonify(result), 200

@app_view.route("/add_plan", methods=["POST", "GET", "PUT"], strict_slashes=False)
@app_view.route("/add_plan/<plan_id>", methods=["DELETE", "PUT"], strict_slashes=False)
@jwt_required()
def add_plan(plan_id=None):
    """

    :return:
    """

    if request.method == "GET":

        all_plan = Db.db_session.query(
            DataPlan, Platform.name, DataPlanType.name, Network.name
        ).join(
            Platform, Platform.platform_id == DataPlan.platform_id
        ).join(
            DataPlanType, DataPlanType.id == DataPlan.plan_type
        ).join(
            Network, Network.network_id == DataPlan.network_id
        ).order_by(DataPlan.network_id).all() if DataPlan.role_validation(
            "admin"
        ) else Db.db_session.query(
            DataPlan, Platform.name, DataPlanType.name, Network.name
        ).filter_by(status="on").join(
            Platform, Platform.platform_id == DataPlan.platform_id
        ).join(
            DataPlanType, DataPlanType.id == DataPlan.plan_type
        ).join(
            Network, Network.network_id == DataPlan.network_id
        ).order_by(DataPlan.plan_id).all()

        ls = []
        for r, p, t, n in all_plan:
            dic = r.to_dict()
            dic["platform_name"] = p
            dic["plan_type"] = t
            dic["network_id"] = n
            dic["net_id"] = r.network_id
            dic["plan_t"] = r.plan_type
            ls.append(dic)

        return jsonify(ls)

    if request.method == "POST":
        if DataPlan.role_validation("admin") is False:
            return jsonify({"status": "error", "message": "not allowed"}), 401

        data = request.get_json()
        if data is None:
            return jsonify({"status": "error", "message": "Form is empty"}), 400

        keys = [
            "platform_id", "plan_name", "plan_type",
            "network_id", "user1_price", "user2_price", "user3_price",
            "user4_price", "user5_price", "user6_price", "validity_days",
            "commission"
        ]

        for key in keys:
            if key not in data:
                return jsonify({"status": "error", "message": "{}".format(key)}), 400
        if Db.db_session.query(DataPlan).filter(
                and_(
                    DataPlan.plan_name==data.get("plan_name"),
                    DataPlan.plan_type==data.get("plan_type"),
                    DataPlan.network_id==data.get("network_id")
                     )
        ).first() is not None:
            return jsonify({"status": "error", "message": "Plan ID Exists"}), 400
        plan_id = Db.db_session.query(DataPlanId).filter(
            and_(
                DataPlanId.platform_id == data.get("platform_id"),
                DataPlanId.plan_type_id == data.get("plan_type"),
                DataPlanId.network_id == data.get("network_id")
            )
        ).first()

        if plan_id is None:
            return jsonify({"status": "error", "message": "Plan Type not on this Platform"}), 400
        id_value = plan_id.get_plan_id(data.get("plan_name"))
        if id_value is None or id_value == "" or id_value == 0:
            return jsonify({"status": "error", "message": "Plan ID not on this platform"}), 400

        try:
            new_plan = DataPlan(**data)
            new_plan.plan_id = id_value
            plan_type = Db.db_session.query(DataPlanType).filter_by(network_id=new_plan.network_id).first()
            new_plan.status = plan_type.status
            new_plan.save()
            return jsonify({"status": "success", "message": "New Data Plan Added Successfully"}), 201
        except Exception:
            return jsonify({"status": "error", "message": "Server Error, Can't add Plan"}), 500

    if request.method == "PUT" and plan_id is not None:
        plan = Db.db_session.query(DataPlan).filter_by(id=plan_id).first()
        if plan is None:
            return jsonify({"status": "error", "message": "Id is empty"}), 402
        plan.update(**{"status": "on" if plan.status == "off" else "off"})
        return jsonify({"status": "success", "message": "Record Updated successfully"}), 201

    if request.method == "PUT":
        if DataPlan.role_validation("admin") is False:
            return jsonify({"status": "error", "message": "not allowed"}), 401
        data = request.get_json()
        if data is None:
            return jsonify({"status": "error", "message": "Form is empty"}), 400

        _id = data.get("id")
        plan = Db.db_session.query(DataPlan).filter_by(id=_id).first()
        if plan.platform_id != data.get("platform_id"):
            data_plan_id = Db.db_session.query(DataPlanId).filter(
                and_(
                    DataPlanId.network_id == plan.network_id,
                    DataPlanId.plan_type_id == plan.plan_type,
                    DataPlanId.platform_id == data.get("platform_id")
                )
            ).first()
            if data_plan_id is None:
                return jsonify({"status": "error", "message": "Plan type not available in platform"}), 400
            plan_id = data_plan_id.get_plan_id(plan.plan_name)
            if plan_id is None:
                return jsonify({"status": "error", "message": "Plan Id not available in platform"}), 400
            data["plan_id"] = plan_id
        plan.update(**data)
        return jsonify({"status": "success", "message": "Record Updated successfully"}), 201

    if request.method == "DELETE":
        if DataPlan.role_validation("admin") is False:
            return jsonify({"status": "error", "message": "not allowed"}), 401

        data = plan_id
        if data is None:
            return jsonify({"status": "error", "message": "Form is empty"}), 400

        plan = Db.db_session.query(DataPlan).filter_by(id=data).first()
        if plan.delete() is True:
            return jsonify({"status": "success", "message": "Record Deleted successfully"}), 201
        return jsonify({"status": "error", "message": "Record was not deleted"}), 500


@app_view.route("/plan_ids", methods=["POST", "GET", "PUT"], strict_slashes=False)
@app_view.route("/plan_ids/<plan_id>", methods=["DELETE", "PUT"], strict_slashes=False)
@jwt_required()
def plan_ids(plan_id=None):
    """

    :return:
    """

    if request.method == "GET":

        all_plan = Db.db_session.query(
            DataPlanId, Platform.name, DataPlanType.name, Network.name
        ).join(
            Platform, Platform.platform_id == DataPlanId.platform_id
        ).join(
            DataPlanType, DataPlanType.id == DataPlanId.plan_type_id
        ).join(
            Network, Network.network_id == DataPlanId.network_id
        ).order_by(DataPlanId.platform_id).all()

        ls = []
        for r, p, t, n in all_plan:
            dic = r.to_dict()
            dic["platform_name"] = p
            dic["plan_type"] = t
            dic["network_id"] = n
            dic["net_id"] = r.network_id
            dic["plan_t"] = r.plan_type_id
            ls.append(dic)

        return jsonify(ls), 200

    if request.method == "PUT":
        if DataPlan.role_validation("admin") is False:
            return jsonify({"status": "error", "message": "not allowed"}), 401
        data = request.get_json()
        if data is None:
            return jsonify({"status": "error", "message": "Form is empty"}), 400

        # keys = [
        #     "id", "mb_250", "mb_500", "mb_750", "gb_1", "gb_1_5", "gb_2", "gb_3", "gb_5",
        #     "gb_10", "gb_12", "gb_15", "gb_20", "gb_25", "gb_30", "gb_40", "gb_50", "gb_75",
        #     "gb_100"
        # ]

        data_list = list(data.values())
        if DataPlanId.has_duplicates_ignore_null(data_list) is True:
            return jsonify({"status": "error", "message": "Id in same platform can't have same values"}), 400

        _id = data.get("id")
        plan = Db.db_session.query(DataPlanId).filter_by(id=_id).first()
        if plan is None:
            return jsonify({"status": "error", "message": "Invalid plan id"}), 400
        plan.update(**data)
        return jsonify({"status": "success", "message": "Record Updated successfully"}), 201

    if request.method == "DELETE":
        if DataPlan.role_validation("admin") is False:
            return jsonify({"status": "error", "message": "not allowed"}), 401

        data = plan_id
        if data is None:
            return jsonify({"status": "error", "message": "Form is empty"}), 400

        plan = Db.db_session.query(DataPlanId).filter_by(id=data).first()
        if plan.delete() is True:
            return jsonify({"status": "success", "message": "Record Deleted successfully"}), 201
        return jsonify({"status": "error", "message": "Record was not deleted"}), 500



@app_view.route("/switch_plan", methods=["POST", "GET"], strict_slashes="False")
@jwt_required()
def switch_plan():
    """

    :return:
    """

    if DataPlan.role_validation("admin") is False:
        return jsonify({"status": "error", "message": "not allowed"}), 401

    data = request.get_json()

    if data is None:
        return jsonify({"status": "error", "message": "Form is Empty"}), 400

    key = data.get("id")
    value = data.get("status")
    plan_type = Db.db_session.query(DataPlanType).filter_by(id=key).first()
    res = plan_type.switch_plan(value)
    return jsonify(
        {
            "status": "success",
            "message": "Plan switch {} successfully".format(res.upper())
        }
    ), 201


@app_view.route("/switch_plan_network", methods=["POST"], strict_slashes="False")
@jwt_required()
def switch_plan_network():
    """

    :return:
    """

    if DataPlan.role_validation("admin") is False:
        return jsonify({"status": "error", "message": "not allowed"}), 401

    data = request.get_json()

    if data is None:
        return jsonify({"status": "error", "message": "Form is Empty"}), 400

    key = data.get("id")
    value = data.get("status")
    network = Db.db_session.query(Network).filter_by(id=key).first()
    plan_type = Db.db_session.query(DataPlanType).filter_by(network_id=network.network_id).all()
    for p in plan_type:
        p.switch_plan(value)
    return jsonify(
        {
            "status": "success",
            "message": "Plan switch  successfully"
        }
    ), 201


@app_view.route("buy_data", methods=["POST"], strict_slashes=False)
@jwt_required()
def buy_data():
    """

    :return:
    """

    data = request.get_json()
    plan = Db.db_session.query(DataPlan).filter(
        and_(
            DataPlan.plan_id == data.get("plan_id"),
            DataPlan.plan_type == data.get("type"),
            DataPlan.network_id == data.get("network_id"),
            DataPlan.platform_id == data.get("platform_id")
        )
    ).first()

    if plan is None:
        return jsonify({
            "status": "error",
            "message": "Error,  Invalid request form"
        }), 400

    platform_id = data.get("platform_id")
    if platform_id is None:
        return jsonify({
            "status": "error",
            "message": "Error,  Provide platform Id"
        }), 400

    platform = Db.db_session.query(Platform).filter_by(platform_id=platform_id).first()
    if platform is None:
        return jsonify({
            "status": "error",
            "message": "Error,  Invalid platform Id"
        }), 400
    if platform.platform_id == 1:
        try:
            user_name = get_jwt_identity()
            user = Db.db_session.query(User).filter_by(user_name=user_name).with_for_update().one()

            channel_obj = Db.db_session.query(Network).filter_by(
                network_id=data.get("network_id")
            ).first()

            if len(str(data.get("phone"))) != 11:
                return jsonify({
                    "status": "error",
                    "message": "Invalid Phone number"
                }), 400

            if data.get("validator") is False:
                code = str(data.get("phone"))[:4]
                if channel_obj.check_network_codes(code) is False:
                    return jsonify({
                        "status": "error",
                        "message": "Error, Not an {} number".format(channel_obj.name)
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
                id=data.get("type")
            ).first()
            plan_type = plan_type_obj.name

            api_data = {
                "network_id": str(plan.network_id),
                "phone": data.get("phone"),
                "plan_id": data.get("plan_id")
            }
            url = "https://www.sahrvtu.com/api/v1/data"
            headers = {
                "Authorization": "Bearer {}".format(platform.api_token),
                "Content-Type": "application/json"
            }
            res = requests.post(url=url,
                json=api_data,
                headers=headers,
                #timeout=180
                )
            if res is None:
                return jsonify({"status": "error", "message": "Api Error"}), 502

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
                "platform": None,
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
                #
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
                return jsonify({"status": "error", "message": "Failed"}), 501
            else:
                return jsonify({"status": "success", "message": "Data purchase was successful"}), 200

        except requests.Timeout:
            return jsonify({"status": "error", "message": "Request timed out after 15 seconds"}), 500

        except requests.ConnectionError:
            return jsonify({"status": "error", "message": "Connection Error"}), 500

        except requests.JSONDecodeError:
            return jsonify({"status": "error", "message": "Invalid Number"}), 400
        except:
            return jsonify({"status": "error", "message": "Network Problem"}), 500
    elif platform.platform_id == 2:
        try:
            user_name = get_jwt_identity()
            user = Db.db_session.query(User).filter_by(user_name=user_name).with_for_update().one()
            user_price = plan.to_dict().get("user{}_price".format(user.type[-1]))
            amount_before = user.balance
            channel_obj = Db.db_session.query(Network).filter_by(
                network_id=data.get("network_id")
            ).first()

            if len(str(data.get("phone"))) != 11:
                return jsonify({
                    "status": "error",
                    "message": "Invalid Phone number"
                }), 400

            if data.get("validator") is False:
                code = str(data.get("phone"))[:4]
                if channel_obj.check_network_codes(code) is False:
                    return jsonify({
                        "status": "error",
                        "message": "Error, Not an {} number".format(channel_obj.name)
                    }), 400

            if user.balance < user_price:
                return jsonify({"status": "error", "message": "Insufficient Funds"}), 400
            else:
                new_balance = user.balance - user_price
                user.balance = new_balance

            channel = channel_obj.name

            plan_type_obj = Db.db_session.query(DataPlanType).filter_by(
                id=data.get("type")
            ).first()
            plan_type = plan_type_obj.name

            api_data = {
                "network_id": str(plan.network_id),
                "phone": data.get("phone"),
                "plan_id": data.get("plan_id")
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
                # timeout=180
                )

            if res is None:
                return jsonify({"status": "error", "message": "Api Error"}), 502

            res_data = res.json()

            if res_data.get("status") is False:
                return jsonify({"status": "error", "message": res_data.get("msg")}), 502

            transaction = {
                "t_type": "DATA",
                "t_disc": "{} {} {} DATA to {}".format(
                    channel,
                    plan.plan_name,
                    plan_type,
                    data.get("phone")
                ),
                "t_date": datetime.utcnow(),
                "details": res_data.get("data").get("msg"),
                "user_name": user.user_name,
                "amount": user_price,
                "amount_before": amount_before,
                "amount_after": new_balance,
                "status": res_data.get("status"),
                "ref": res_data.get("reference"),
                "channel": channel,
                "platform": None,
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
                return jsonify({"status": "error", "message": "Failed"}), 501
            else:
                return jsonify({"status": "success", "message": "Data purchase was successful"}), 200

        except requests.Timeout:
            return jsonify({"status": "error", "message": "Request timed out after 15 seconds"}), 500

        except requests.ConnectionError:
            return jsonify({"status": "error", "message": "Connection Error"}), 500

        except requests.JSONDecodeError:
            return jsonify({"status": "error", "message": "Invalid Number"}), 400

    elif platform.platform_id == 3:
        try:
            user_name = get_jwt_identity()
            user = Db.db_session.query(User).filter_by(user_name=user_name).with_for_update().one()

            channel_obj = Db.db_session.query(Network).filter_by(
                network_id=data.get("network_id")
            ).first()

            if len(str(data.get("phone"))) != 11:
                return jsonify({
                    "status": "error",
                    "message": "Invalid Phone number"
                }), 400

            if data.get("validator") is False:
                code = str(data.get("phone"))[:4]
                if channel_obj.check_network_codes(code) is False:
                    return jsonify({
                        "status": "error",
                        "message": "Error, Not an {} number".format(channel_obj.name)
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
                id=data.get("type")
            ).first()
            plan_type = plan_type_obj.name

            api_data = {
                "network_id": str(plan.network_id),
                "phone": data.get("phone"),
                "plan_id": data.get("plan_id")
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
                return jsonify({"status": "error", "message": "Api Error"}), 502

            res_data = res.json()
            print(res_data)

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
                "platform": None,
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
                #
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
                return jsonify({"status": "error", "message": "Failed"}), 501
            else:
                return jsonify({"status": "success", "message": "Data purchase was successful"}), 200

        except requests.Timeout:
            return jsonify({"status": "error", "message": "Request timed out after 15 seconds"}), 500

        except requests.ConnectionError:
            return jsonify({"status": "error", "message": "Connection Error"}), 500

        except requests.JSONDecodeError:
            return jsonify({"status": "error", "message": "Invalid Number"}), 400

        except:
            return jsonify({"status": "error", "message": "Network Problem"}), 500

@app_view.route("get_data", methods=["GET"], strict_slashes=False)
def get_data_info():
    """

    """

    plans = Db.db_session.query(
        DataPlan.network_id, DataPlan.user1_price, DataPlan.plan_name,
        DataPlan.validity_days, DataPlanType.name
    ).join(
        DataPlanType, DataPlan.plan_type == DataPlanType.id
    ).order_by(DataPlan.network_id).all()


    json_data = {"MTN": [], "GLO": [], "AIRTEL": [], "9MOBILE": []}
    for network_id, price, name, validity, p_type in plans:
        data = {"name": name,
                "price": price,
                "validity": validity,
                "type": p_type
                }
        if network_id == 1:
            json_data["MTN"].append(data)
        elif network_id == 2:
            json_data["AIRTEL"].append(data)
        elif network_id == 3:
            json_data["GLO"].append(data)
        elif network_id == 4:
            json_data["9MOBILE"].append(data)
    site_data = {"plans": json_data}
    return jsonify(site_data)


