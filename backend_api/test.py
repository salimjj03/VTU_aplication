import jwt
import base64
import json
import time


def base64url_encode(data):
    """Encodes data using Base64 URL encoding (without padding)."""
    return base64.urlsafe_b64encode(data).decode('utf-8').rstrip("=")


def get_access_token(ph):
    payload = {
        "https://mymtn.com/loginCount": 1,
        "https://mymtn.com/userMetaData": [],
        "https://mymtn.com/secondaryProfile": [
            {
                "provider": "sms",
                "connection": "sms",
                "isSocial": False,
            },
        ],
        "https://mymtn.com/phone_number": "+234" + ph[1:],  # Format phone number
        "iss": "https://auth.mtnonline.com/",
        "aud": [
            "NextGenAPI",
            "https://mtnng-prod.mtn.auth0.com/userinfo",
        ],
        "iat": int(time.time()),  # Current timestamp
        "exp": int(time.time()) + 3600,  # Token expires in 1 hour
        "scope": "openid profile email offline_access",
        "gty": ["refresh_token", "password"],
        "azp": "WO5BbTyEWLSFvFPw5TsYoioTQqcq8Mq3",
    }

    encoded_payload = base64url_encode(json.dumps(payload).encode('utf-8'))

    # Hardcoded JWT header and signature
    header = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InJibkxaMy1PM1BPd09pQ3JTOXJBcSJ9"
    signature = "EyELXFxE7DWBYvwpNXwx-bcmgGhIgQU1hS44FPvEfIo"

    access_token = f"{header}.{encoded_payload}.{signature}"

    return access_token


import requests


def make_app_request(url, payload, headers=None, timeout=0):
    """
    Sends a POST request to the specified URL with the given payload and headers.

    Args:
        url (str): The target URL for the request.
        payload (dict or str): The data to send in the request body.
        headers (dict, optional): Additional HTTP headers.
        timeout (int, optional): Request timeout in seconds.

    Returns:
        tuple: (HTTP status code, response text)
    """
    # Default headers
    default_headers = {
        "Content-Type": "application/json",
        "User-Agent": "okhttp/4.10.0",
        "x-country-code": "nga",
        "access-control-allow-origin": "*"
    }

    # Merge default headers with user-provided headers (if any)
    if headers:
        default_headers.update(headers)

    try:
        # Send POST request
        response = requests.post(url, json=payload, headers=default_headers)
        return response.status_code, response.text
    except requests.exceptions.RequestException as e:
        return None, str(e)

def app_login(phone):
    """
    Initiates a passwordless login request for the given phone number.

    Args:
        phone (str): The user's phone number in international format.

    Returns:
        tuple: (HTTP status code, response text)
    """
    new_phone = "+234" + phone[1:]  # Convert phone number to Nigerian format
    req_headers = {
        "msisdn-code": "234",
        "host": "auth.mtnonline.com"
    }

    url = "https://auth.mtnonline.com/passwordless/start"
    payload = {
        "phone_number": new_phone,
        "connection": "sms"
    }

    response = make_app_request(url, payload, req_headers)
    print(response)
    return response


def app_verify(phone, otp):
    """
    Verifies an OTP for a passwordless login process.

    Args:
        phone (str): The user's phone number in international format.
        otp (str): The one-time password received via SMS.

    Returns:
        tuple: (HTTP status code, response text)
    """
    new_phone = "+234" + phone[1:]  # Convert phone number to Nigerian format
    req_headers = {
        "msisdn-code": "234"
    }

    payload = {
        "username": new_phone,
        "otp": otp,
        "audience": "NextGenAPI",
        "scope": "openid profile email offline_access",
        "client_id": "lTCnmXpSbMkLFZlvj33KPh1u17eWsRn2",
        "realm": "sms",
        "grant_type": "http://auth0.com/oauth/grant-type/passwordless/otp"
    }

    url = "https://auth.mtnonline.com/oauth/token"
    response = make_app_request(url, payload, req_headers)
    print(response)
    return response


app_login("07034954579")
# app_verify("07034954579", "511835")
