#!/usr/bin/env python3
"""
plan size modules
"""

from sqlalchemy import Column, String, Integer, Numeric, DateTime, Text
from modules.base import DB_base, Base
from datetime import datetime


class Transaction(DB_base):
    """
    plan size  class
    """

    __tablename__ = "transactions"

    id = Column(
        Integer,
        primary_key=True,
        autoincrement=True,
        unique=True,
        nullable=False
    )

    t_type = Column(String(250))
    t_disc = Column(String(250))
    t_date = Column(DateTime)
    details = Column(String(250))
    user_name = Column(String(250))
    amount = Column(String(250))
    amount_before = Column(String(250))
    amount_after = Column(String(250))
    status = Column(String(250))
    ref = Column(String(250))
    channel = Column(String(250))
    platform = Column(String(250))
    rtr = Column(Text)

    def __init__(self, **kwargs):
        """
        :param kwargs:
        """

        self.t_date = datetime.utcnow()
        if kwargs:
            for key, value in kwargs.items():
                setattr(self, key, value)

    def to_dict(self):
        """
        :return:
        """

        return Base.to_dict(self)

    def __str__(self):
        """
        :return:
        """

        return Base.__str__(self)