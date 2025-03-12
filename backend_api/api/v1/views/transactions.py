#!/usr/bin/env python3
"""

"""

from api.v1.views import app_view
from flask import jsonify, request
from modules.transaction import Transaction
from modules.admin import Admin
from modules.airtime import Airtime
from modules.engine.db import Db
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import desc
from modules.user import User
from modules.admin import Admin


@app_view.route("/transactions", strict_slashes=False)
@app_view.route("/transactions/<t_id>", strict_slashes=False)
@jwt_required()
def transactions(t_id=None):
    """

    :return:
    """

    if t_id:
        transaction = Db.db_session.query(Transaction).filter_by(id=t_id).first()
        return jsonify(transaction.to_dict()), 200

    user_name = get_jwt_identity()
    user = Db.db_session.query(Admin).filter_by(user_name=user_name).first()
    if user and user.role == "admin":
        transactions = Db.db_session.query(Transaction).order_by(desc(Transaction.t_date)).all()
    else:
        transactions = Db.db_session.query(Transaction).filter_by(user_name=user_name).order_by(desc(Transaction.t_date)).all()
    json_data = [t.to_dict() for t in transactions]
    return jsonify(json_data), 200