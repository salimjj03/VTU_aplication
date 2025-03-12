#!/usr/bin/env python3
"""

"""

from api.v1.views import app_view
from flask import request, render_template, session, jsonify
from modules.admin import Admin
from modules.engine.db import Db
from modules.network import Network
from flask_jwt_extended import jwt_required


@app_view.route("/networks", methods=["GET"], strict_slashes="False")
@jwt_required()
def network():
    networks = Db.db_session.query(Network).order_by(Network.network_id).all()
    dict_data = [d.to_dict() for d in networks]
    return jsonify(dict_data), 200



@app_view.route("/add_network", methods=["POST"], strict_slashes="False")
@jwt_required()
def add_network():
    """

    :return:
    """

    if Network.role_validation("admin") is False:
        return jsonify({"status": "error", "message": "not allowed"}), 401

    data = request.get_json()
    if data is None:
        return jsonify({"status": "error", "message": "Form is empty"}), 400

    if Db.db_session.query(Network).filter_by(network_id=data.get("network_id")).first() is not None:
        return jsonify({"status": "error", "message": "Network Id Exist"}), 400

    if Db.db_session.query(Network).filter_by(name=data.get("name")).first() is not None:
        return jsonify({"status": "error", "message": "Name Exist"}), 400

    try:
        new_network = Network(**data)
        new_network.save()
        return jsonify({"status": "success", "message": "Network Add Successfully"}), 200

    except Exception:
        return jsonify({"status": "error", "message": "Server Error Can't add Network"}), 500


@app_view.route("/view_networks", methods=["GET"], strict_slashes="False")
@app_view.route("/view_networks/<net_id>", methods=["DELETE"], strict_slashes="False")
@jwt_required()
def view_networks(net_id=None):
    """

    :return:
    """

    if Network.role_validation("admin") is False:
        return jsonify({"status": "error", "message": "not allowed"}), 401

    if request.method == "GET":
        networks = Db.all("Network")
        result = [n.to_dict() for n in networks]
        return jsonify(result), 200

    if request.method == "DELETE":
        data = net_id
        if data == "" or data is None:
            return jsonify({"status": "error", "message": "form is empty"}), 400

        network = Db.db_session.query(Network).filter_by(id=data).first()

        try:
            network.delete()
            return jsonify({"status": "success", "message": "Network Deleted Successfully"}), 200

        except:
            return jsonify({"status": "error", "message": "Foreign Key constraint"}), 500



@app_view.route("/add_network_code", methods=["POST"], strict_slashes="False")
@jwt_required()
def add_network_code():
    """

    :return:
    """

    if Network.role_validation("admin") is False:
        return jsonify({"status": "error", "message": "not allowed"}), 401

    data = request.get_json()
    network = Db.db_session.query(Network).filter_by(network_id=data.get("network_id")).first()
    new_code = data.get("network_code")
    if new_code:
        json_data = {"network_code": new_code}
        res = network.add_network_code(**json_data)
        if res.get("status") == "error":
            return jsonify(res), 400
        return jsonify(res), 201
