#!/usr/bin/env python3
"""

"""

from api.v1.views import app_view
from flask import jsonify, request
from modules.user import User
from modules.transaction import Transaction
from modules.engine.db import Db
from flask_jwt_extended import jwt_required, get_jwt_identity
import uuid
from sqlalchemy import desc
from modules.notifications import Notification
from decimal import Decimal
from datetime import datetime
from modules.config import Config

import hashlib
import hmac
import json


@app_view.route('/payment_point_webhook', methods=['POST'])
def payment_point_webhook():
    """

    """

    payment_point = Config.get_payment_point()
    if payment_point and payment_point.get("secret_key"):
        security_key = payment_point.get("secret_key")
        webhook_data = request.data  # Raw bytes

        # Get the Paymentpoint-Signature from the request headers
        signature = request.headers.get('Paymentpoint-Signature')

        # Recreate the hash using the raw body and your security key
        calculated_signature = hmac.new(
            security_key.encode('utf-8'),
            webhook_data,
            hashlib.sha256
        ).hexdigest()

        # Verify if the calculated signature matches the one in the header
        if calculated_signature == signature:
            # Signature is valid, process the webhook data
            try:
                # Parse the incoming JSON data

                data = json.loads(webhook_data)

                # Extract relevant data
                transaction_id = data.get('transaction_id')
                amount_paid = data.get('amount_paid')
                settlement_amount = data.get('settlement_amount')
                status = data.get('transaction_status')

                email = data.get("customer").get("email")
                user = Db.db_session.query(User).filter_by(email=email).first()

                transaction = Transaction(**{
                    "t_disc": "Wallet Funded Via Palmpay",
                    "channel": "FUNDING",
                    "amount": Decimal(settlement_amount),
                    "amount_before": user.balance,
                    "amount_after": user.balance + Decimal(settlement_amount),
                    "user_name": user.user_name,
                    "status": status,
                    "ref": transaction_id,
                    "rtr": "",
                    "t_type": "FUNDING",
                    "t_date": datetime.utcnow()
                })
                Db.db_session.add(transaction)
                Db.db_session.commit()
                user.update(**{"balance": user.balance + Decimal(settlement_amount)})
                # Respond with a 200 OK status to acknowledge receipt of the webhook
                return jsonify({"status": "success"}), 200
            except json.JSONDecodeError:
                return jsonify({"error": "Invalid JSON format"}), 400
        else:
            # Invalid signature, reject the request
            return jsonify({"error": "Invalid signature"}), 400

    return jsonify({"error": "Invalid signature"}), 400

