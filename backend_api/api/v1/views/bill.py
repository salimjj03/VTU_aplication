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


@app_view.route("/bill", methods=["POST", "GET"], strict_slashes="False")
def bill(plan_id=None):
    """

    :return:
    """

    pass