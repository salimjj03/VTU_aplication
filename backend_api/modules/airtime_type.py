#!/usr/bin/env python3
"""
plan size modules
"""

from sqlalchemy import Column, String, Integer
from modules.base import Base, DB_base


class AirtimeType(Base, DB_base):
    """
    plan size  class
    """

    __tablename__ = "airtime_types"

    name = Column(String(45), unique=True, nullable=False)
    status = Column(Integer, default=1, nullable=False)
    disc = Column(Integer, default=0, nullable=False)