#!/usr/bin/env python3
"""
plan size modules
"""

from sqlalchemy import Column, String, Integer, JSON
from flask import jsonify
from modules.base import Base, DB_base
import json


class Network(Base, DB_base):
    """
    plan size  class
    """

    __tablename__ = "networks"

    network_id = Column(Integer, unique=True, nullable=False)
    name = Column(String(45), unique=True, nullable=False)
    network_codes = Column(JSON)

    def add_network_code(self, **kwargs):
        """

        :return:
        """

        from modules.engine.db import Db

        try:

            if len(kwargs.get("network_code")) != 4:
                raise ValueError

            new_code = kwargs.get("network_code")

            if self.network_codes is None:
                self.network_codes = json.dumps({"codes": [new_code]})
            else:
                data = json.loads(self.network_codes)
                if new_code in data.get("codes"):
                    return {"status": "error", "message": "Codes Exist"}
                data.get("codes").append(new_code)
                self.network_codes = json.dumps(data)
            Db.db_session.commit()
            return {"status": "success", "message": "Codes Updated Successfully"}

        except ValueError:
            return {"status": "error", "message": "Code length must be equal to 4"}

        except:
            return {"status": "error", "message": "Error, Codes not updated"}

    def check_network_codes(self, code):
        """

        :param code:
        :return:
        """

        if not self.network_codes:
            return False
        codes = json.loads(self.network_codes)
        if code in codes.get("codes"):
            return True
        return False
