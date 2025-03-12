#!/usr/env python3
"""

"""

from flask import  Flask, jsonify, request, g
from api.v1.views import app_view
from api.v1.views import api_view
from modules.engine.db import Db
from modules.user import User
from modules.admin import Admin
from modules.config import Config
from flask_cors import CORS
from flask_jwt_extended import  JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta


app = Flask(__name__)
app.secret_key = "000000jara"
app.config["JWT_SECRET_KEY"] = "jjvtu.api_backendjaradat@feb21salimjj"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=5)
jwl = JWTManager(app)
app.register_blueprint(app_view)
app.register_blueprint(api_view)
CORS(app)
#cors = CORS(app, resources={r"/*": {"origins": "*"}})

@app.before_request
def verify_api_request():
    if request.path.startswith("/v2"):
        authorization = request.headers.get("Authorization")
        if authorization is None:
            return jsonify({"status": False, "message": "missing authorization"}), 401

        parts = authorization.split(" ")
        if len(parts) != 2 or parts[0] != "Bearer":
            return jsonify({"status": False, "message": "Invalid authorization"}), 401
        token = parts[1]
        user = Db.db_session.query(User).filter_by(auth_token=token).first()
        if user is None:
            return jsonify({"status": False, "message": "Invalid Token"}), 401
        g.user = user

@app.route("/", strict_slashes=False)
#@jwt_required()
def home():
    """

    :return:
    """

    config = Db.db_session.query(Config).first()
    if config is not None and config.site_name:
        return jsonify({"home": "Welcome to {}".format(config.site_name)})
    return jsonify({"home": "Welcome to API"})

@app.route("/api/v1/login", methods=["POST"], strict_slashes=False)
def login():
    """

    :return:
    """
    if request.method == "POST":
        data = request.get_json()
        user_name = data.get("user_name")
        user = Db.db_session.query(User).filter_by(user_name=user_name).first()
        if user is None:
            return jsonify({"status": "error", "message": "No user found"}), 400
        else:
            if user.check_password(data.get("password")):
                if user.accounts is None or user.accounts == "":
                    user.get_reserve()
                    if user.accounts is None or user.accounts == "":
                        #print(user.accounts)
                        user.account_reserve()
                if user.payment_point is None or user.payment_point == "":
                    user.get_payment_point()
                user.token = create_access_token(identity=user_name, additional_claims={"role": user.role})
                res = user.to_dict()
                # user.update(**{"token": user.token})

                return jsonify(res), 200
            else:
                return jsonify({"status": "error", "message": "Invalid Login"}), 401



@app.route("/api/v1/admin_login", methods=["POST"], strict_slashes=False)
def admin_login():
    """

    :return:
    """
    if request.method == "POST":
        data = request.get_json()
        user_name = data.get("user_name")
        user = Db.db_session.query(Admin).filter_by(user_name=user_name).first()
        if user is None:
            return jsonify({"status": "error", "message": "No user found"}), 400
        else:
            if user.check_password(data.get("password")):
                user.token = create_access_token(identity=user_name, additional_claims={"role": user.role})
                res = user.to_dict()
                # user.update(**{"token": user.token})

                return jsonify(res), 200
            else:
                return jsonify({"status": "error", "message": "Invalid Login"}), 401



@app.route("/api/v1/contact_info", strict_slashes=False)
def contact_info():
    """

    """

    
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
        "info": info
    }
    return jsonify(data), 200





@app.teardown_appcontext
def teardown(exc):
    """
    The application context in Flask is typically
    created at the beginning of a request and torn
    down after the request has been handled.
    :param exc:
    :return:
    """

    if Db.db_session is not None:
        Db.db_session.remove()


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
