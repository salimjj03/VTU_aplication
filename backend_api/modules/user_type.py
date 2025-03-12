#!/usr/bin/env python3
"""
type of users
"""

from sqlalchemy import Column, String
from modules.base import Base, DB_base


class UserType(Base, DB_base):
    """
    user_type class
    """

    __tablename__ = "user_types"

    name = Column(String(45), unique=True, nullable=False)
    role = Column(String(45), unique=True, nullable=False)
    status = Column(String(45), default="active", nullable=False)
