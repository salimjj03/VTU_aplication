#!/usr/bin/env python3
"""

"""

from  flask import Blueprint

app_view = Blueprint("app_view", __name__, url_prefix="/api/v1/")
api_view = Blueprint("api_view", __name__, url_prefix="/v2/")

from api.v1.views.user import *
from api.v1.views.transactions import *
from api.v1.views.admin import *
from api.v1.views.data import *
from api.v1.views.network import *
from api.v1.views.airtime import *
from api.v1.views.bill import *
from api.v1.views.cable import *
from api.v1.views.electricity import *
from api.v1.views.web_hook import *
from api.v1.views.canfig import *
from api.v1.views.api import *
