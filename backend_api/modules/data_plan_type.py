#!/usr/bin/env python3
"""
plan size modules
"""

from sqlalchemy import Column, String, Integer, ForeignKey
from modules.base import Base, DB_base


class DataPlanType(Base, DB_base):
    """
    plan size  class
    """

    __tablename__ = "data_plan_types"

    network_id = Column(Integer, ForeignKey("networks.network_id"), nullable=False)
    name = Column(String(45), nullable=False)
    status = Column(String(45), nullable=False)

    def switch_plan(self, value):
        """

        :param value:
        :return:
        """

        from modules.engine.db import Db
        from modules.data_plan import DataPlan

        plan_types = Db.db_session.query(DataPlan).filter_by(plan_type=self.id).all()
        if len(plan_types) > 0:
            for plan_type in plan_types:
                plan_type.status = value
        self.status = value
        Db.db_session.commit()
        return value
