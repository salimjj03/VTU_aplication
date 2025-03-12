#!/usr/bin/env python3
"""
database module
"""

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, scoped_session
from modules.transaction import Transaction
from modules.user import User
from modules.admin import Admin
from modules.user_type import UserType
from modules.data_plan import DataPlan
from modules.data_plan_name import DataPlanName
from modules.network import Network
from modules.data_plan_size import DataPlanSize
from modules.airtime import Airtime
from modules.airtime_type import AirtimeType
from modules.data_plan_type import DataPlanType
from modules.cable import Cable
from modules.bill import Bill
from modules.config import Config
from modules.notifications import Notification
from modules.platform import Platform
from modules.data_paln_id import DataPlanId
from modules.base import DB_base


class Db:
    """
    database class
    """

    __db_engine = None
    db_session = None
    
    
    def __init__(self):
        self.__db_engine = create_engine(
            "mysql+pymysql://{}:{}3492@localhost/vtusite".format(env.get(db_user, env.get(db_pass)),
            pool_pre_ping=True,
        )

        DB_base.metadata.create_all(bind=self.__db_engine)

        with self.__db_engine.connect() as conn:
            conn.execute(text("ALTER TABLE data_plans AUTO_INCREMENT = 100;"))
            conn.commit()#

    @classmethod
    def all(cls, cls_name):
        """

        :param cls:
        :return:
        """

        try:
            cls_name = globals()[cls_name]
        except Exception:
            return []

        #from modules.admin import Admin
        return cls.db_session.query(cls_name).all()

    def session(self):
        """

        :return:
        """

        Db.db_session = scoped_session(
            sessionmaker(bind=self.__db_engine)
        )


    def save(self, obj):
        """

        :return:
        """
        self.db_session.add(obj)
        self.db_session.commit()


