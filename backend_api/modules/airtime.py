#!/usr/bin/env python3
"""
plan size modules
"""

from sqlalchemy import Column, String, Integer, ForeignKey
from modules.base import Base, DB_base


class Airtime(Base, DB_base):
    """
    plan size  class
    """

    __tablename__ = "airtime"

    name = Column(String(45), unique=True, nullable=False)

    network_id = Column(
        Integer,
        ForeignKey("networks.network_id"),
        nullable=False
    )

    airtime_type = Column(
        String(200),
        ForeignKey("airtime_types.id"),
        nullable=False
    )
