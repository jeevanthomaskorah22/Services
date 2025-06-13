from sqlalchemy import Column, String, Date, Enum as SqlEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from uuid import uuid4
from enum import Enum
from sqlalchemy import Integer

Base = declarative_base()

class ShippingStatus(str, Enum):
    Pending = "Pending"
    Shipped = "Shipped"
    InTransit = "In Transit"
    Delivered = "Delivered"

class Shipment(Base):
    __tablename__ = "shipments"

    tracking_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    order_id = Column(Integer, nullable=False)    
    status = Column(SqlEnum(ShippingStatus), nullable=False)
    estimated_delivery = Column(Date)
    tracking_site_link = Column(String)
