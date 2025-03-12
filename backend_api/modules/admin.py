#!/usr/bin/env python3
"""
Admin module
"""

from modules.base import Base, DB_base
from sqlalchemy import Column, String, Integer, Numeric, ForeignKey, Text


class Admin(Base, DB_base):
    """
    user class which inherite from Base and db_base
    """
    __tablename__ = "admins"

    full_name = Column(String(255), nullable=False)
    user_name = Column(String(255), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    phone_no = Column(String(45), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    type = Column(String(255), default="type_1", nullable=False)
    role = Column(String(225), default="admin", nullable=False)
    token = Column(Text)
