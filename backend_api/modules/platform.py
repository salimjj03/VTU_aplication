#!/usr/bin/env python3
"""

"""

from modules.base import Base, DB_base
from sqlalchemy import Column, String, Text, Integer
import json


class Platform(Base, DB_base):
    """

    """

    __tablename__ = "platforms"
    name = Column(String(200), unique=True, nullable=False)
    platform_id = Column(Integer, unique=True, nullable=False)
    api_token = Column(Text, nullable=False)
