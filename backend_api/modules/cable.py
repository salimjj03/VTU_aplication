#!/usr/bin/env python3
"""
bills
"""

from sqlalchemy import Column, String, Integer, Numeric
from modules.base import Base, DB_base


class Cable(Base, DB_base):
    """
    plan size  class
    """

    __tablename__ = "cables"

    name = Column(String(200), nullable=False)
    amount = Column(Integer,  nullable=False)
    plan_id = Column(String(45), unique=True, nullable=False)
    decoder_id = Column(String(45), nullable=False)
    status = Column(String(45), default=1)
    charges = Column(Numeric(10), default=0, nullable=False)