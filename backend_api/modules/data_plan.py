#!/usr/bin/env python3
"""
data plane module
"""

from sqlalchemy import Column, String, ForeignKey, Numeric, Integer
from modules.base import Base, DB_base
from modules.data_plan_type import DataPlanType


class DataPlan(Base, DB_base):
    """
    data plane class
    """

    __tablename__ = "data_plans"

    id = Column(
        Integer,
        primary_key=True,
        autoincrement=True,
        unique=True,
        nullable=False
    )
    platform_id = Column(Integer, ForeignKey("platforms.platform_id"), nullable=False)
    plan_id = Column(Integer, nullable=False)
    plan_name = Column(String(45), ForeignKey("data_plan_names.name"), nullable=False)
    plan_type = Column(String(45), ForeignKey("data_plan_types.id"), nullable=False)
    network_id = Column(Integer, ForeignKey("networks.network_id"), nullable=False)
    user1_price = Column(Numeric(10), nullable=False)
    user2_price = Column(Numeric(10), nullable=False)
    user3_price = Column(Numeric(10), nullable=False)
    user4_price = Column(Numeric(10), nullable=False)
    user5_price = Column(Numeric(10), nullable=False)
    user6_price = Column(Numeric(10), nullable=False)
    validity_days = Column(Integer, nullable=False)
    status = Column(String(45), default="on", nullable=False)
    commission = Column(Numeric(10), default=0)

    def __init__(self, **kwargs):
         super().__init__(**kwargs)


    def is_available_bundle(self, user):
        """

        """
        from modules.engine.db import Db

        if len(self.plan_name.split(" ")) != 2:
            return False
        unit = self.plan_name.split(" ")[1].upper()
        plan_size = int(self.plan_name.split(" ")[0]) if unit == "GB" else float(int(self.plan_name.split(" ")[0]) / 1000)

        plan_type = Db.db_session.query(DataPlanType).filter_by(id=self.plan_type).first()
        if plan_type.name.lower() == "sme" and  self.network_id == 1:
            if user.mtn_sme_bundle < plan_size:
                return False
            return {
                "bundle": "mtn_sme_bundle",
                "size": plan_size,
                "before": user.mtn_sme_bundle,
                "after": float(user.mtn_sme_bundle) - plan_size
            }

        elif plan_type.name.upper() == "CORPORATE-GIFTING" and  self.network_id == 1:
            if user.mtn_cg_bundle < plan_size:
                return False
            return {
                "bundle": "mtn_cg_bundle",
                "size": plan_size,
                "before": user.mtn_cg_bundle,
                "after": float(user.mtn_cg_bundle) - plan_size
            }

        elif plan_type.name.upper() == "CORPORATE-GIFTING" and  self.network_id == 2:
            if user.airtel_cg_bundle < plan_size:
                return False
            return {
                "bundle": "airtel_cg_bundle",
                "size": plan_size,
                "before": user.airtel_cg_bundle,
                "after": float(user.airtel_cg_bundle) - plan_size
            }

        elif plan_type.name.upper() == "CORPORATE-GIFTING" and  self.network_id == 3:
            if user.glo_cg_bundle < plan_size:
                return False
            return {
                "bundle": "glo_cg_bundle",
                "size": plan_size,
                "before": user.glo_cg_bundle,
                "after": float(user.glo_cg_bundle) - plan_size
            }

        elif plan_type.name.upper() == "CORPORATE-GIFTING" and  self.network_id == 4:
            if user.mobile_cg_bundle < plan_size:
                return False
            return {
                "bundle": "mobile_cg_bundle",
                "size": plan_size,
                "before": user.mobile_cg_bundle,
                "after": float(user.mobile_cg_bundle) - plan_size
            }

        else:
            return False






