#!/usr/bin/env python3
"""
base module
"""
from operator import index

from sqlalchemy import Column, String, DateTime, Integer
from sqlalchemy.orm import declarative_base
from uuid import uuid4
from datetime import datetime
import bcrypt
import base64
import json
from flask_jwt_extended import get_jwt



DB_base = declarative_base()
time = "%Y-%m-%dT%H:%M:%S.%f"


class Base:
    """
    The base class that will be inherited by all classes
    """

    id = Column(String(45), primary_key=True, nullable=False)
    created_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime, nullable=False)

    def __init__(self, **kwargs):
        """
        the constructor class
        """

        if self.__class__.__name__ != "DataPlan":
            self.id = str(uuid4())
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
        if kwargs:
            for key, value in kwargs.items():
                setattr(self, key, value)
        if self.__class__.__name__ == "Admin" or self.__class__.__name__ == "User":
            self.password = self.encrypt_password(self.password)


    def all(self):
        """

        :return:
        """

        from modules import storage
        return storage.all(self.__class__.__name__)

    def to_dict(self):
        """
        :return: dictionary representation
        of object
        """

        from modules.user import User

        dic = self.__dict__.copy()
        if "_sa_instance_state" in dic:
            del dic["_sa_instance_state"]

        if "password" in dic:
            del dic["password"]

        if "created_at" in dic:
            dic["created_at"] = dic["created_at"].strftime(time)

        if "updated_at" in dic:
            dic["updated_at"] = dic["updated_at"].strftime(time)

        if "accounts" in dic and isinstance(self, User) and dic["accounts"] is not None:
            dic["accounts"] = json.loads(dic["accounts"])

        if "payment_point" in dic and isinstance(self, User) and dic["payment_point"] is not None:
            dic["payment_point"] = json.loads(dic["payment_point"])
            if dic["accounts"] is None:
                dic["accounts"] = dic["payment_point"]
            else:
                for p in dic["payment_point"]:
                    dic["accounts"].append(p)

        return dic

    def __str__(self):
        """
        :return: string representation of obj
        """

        dic = self.to_dict()
        return "{}".format(dic)

    @staticmethod
    def percent(amount, discount):
        """

        """

        return (int(amount) * int(discount)) / 100

    def save(self):
        """

        :return:
        """

        from modules.engine.db import Db

        Db.db_session.add(self)
        Db.db_session.commit()


    @staticmethod
    def encord_str(string):
        """

        :param string
        :return:
        """
        b_string = string.encode("utf-8")
        base64_str = base64.b64encode(b_string)
        return base64_str

    @staticmethod
    def decord_str(string):
        """

        :param string
        :return:
        """
        b_string = string.encode("utf-8")
        base64_str = base64.b64decode(b_string)
        return base64_str


    def encrypt_password(self, password):
        """

        :param password:
        :return:
        """
        users = ["Admin", "User"]
        if self.__class__.__name__ not in users:
            return None

        return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    def check_password(self, password):
        """

        :param password:
        :return:
        """

        users = ["Admin", "User"]
        if self.__class__.__name__ not in users:
            return None

        return bcrypt.checkpw(password.encode("utf-8"), self.password.encode("utf-8"))

    @classmethod
    def has_duplicates_ignore_null(cls, lst):
        seen = set()

        for item in lst:
            if item not in (None, ""):  # Ignore null-like values
                if str(item) in seen:
                    return True
                seen.add(str(item))
        return False

    def update(self, **kwargs):
        """

        :param kwargs:
        :return:
        """

        from modules.engine.db import Db

        if len(kwargs) == 1:
            key = next(iter(kwargs))
            setattr(self, key, kwargs.get(key))
            self.updated_at = datetime.utcnow()

            Db.db_session.commit()

        if len(kwargs) > 1:
            for key, value in kwargs.items():
                if value is not None and value != "":
                    setattr(self, key, value)

            self.updated_at = datetime.utcnow()
            Db.db_session.commit()

    def delete(self):
        """

        :return:
        """

        from modules.engine.db import Db

        Db.db_session.delete(self)
        Db.db_session.commit()
        return True

    @classmethod
    def role_validation(cls, role):
        """

        """

        claims = get_jwt()
        user_role = claims.get("role")
        if role == user_role:
            return True
        return False

    @staticmethod
    def pagination(page, page_size):
        """

        :param page:
        :param page_size:
        :return:
        """

        start_index = (page * page_size) - page_size
        end_index = page * page_size
        return (start_index, end_index)

    @staticmethod
    def get_page(items, page_no=1, page_size=10):
        index = Base.pagination(int(page_no), int(page_size))

        #if index[0] < len(items) and len(items) < index[1]:
            #return items[index[0]: len(items)]

        return items[index[0]: index[1]]

    @staticmethod
    def get_hyper(data_set, page=1, page_size=20):
        page_size = int(page_size)
        data_size = len(data_set)
        page = int(page)
        link = data_size // page_size if data_size % page_size == 0 else data_size // page_size + 1
        next_index = page + 1 if page + 1 <= link else page
        prev_index = page - 1 if page - 1 > 0 else page
        new_data_set = Base.get_page(data_set, page, page_size)
        pagination = {
            "index": page,
            "next_index": next_index,
            "page_size": page_size,
            "data_set": new_data_set,
            "links": range(1, link + 1),
            "prev_index": prev_index
        }
        return pagination

    # @staticmethod
    # def credit(**kwargs):
    #     """
    #
    #     """
    #
    #     from modules.transaction import Transaction
    #     new_t = Transaction(**kwargs)
    #     Base.save(new_t)
    #
    # @staticmethod
    # def debit(**kwargs):
    #     """
    #
    #     """
    #
    #     from modules.transaction import Transaction
    #     new_t = Transaction(**kwargs)
    #     Base.save(new_t)