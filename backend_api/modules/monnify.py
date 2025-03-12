#!/usr/bin/env python3
"""
User module
"""

from modules.base import Base, DB_base
from sqlalchemy import Column, String, Integer, Numeric, ForeignKey
from modules.config import Config


class Monnify(Base):
    """
    user class which inherite from Base and db_base
    """

    def gat_token(self):
        """

        :return:
        """

        monnify = Config.get_monnify()
        if monnify and monnify.get("api_key") and monnify.get("secret_key"):

            api_k = monnify.get("api_key")
            sec_k = monnify.get("secret_key")
            key = "{}:{}".format(api_k, sec_k)

            monnify_token = self.encord_str(key)
            return monnify_token.decode("utf-8")
        return None
