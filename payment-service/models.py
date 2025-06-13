from sqlalchemy import Column, Integer, String, Float, Enum
from sqlalchemy.ext.declarative import declarative_base
from uuid import uuid4
from enum import Enum as PyEnum

Base = declarative_base()

class PaymentStatus(str, PyEnum):
    Initiated = "Initiated"
    Success = "Success"
    Failed = "Failed"

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    payment_id = Column(String, default=lambda: str(uuid4()), unique=True, index=True)  # UUID as string
    order_id = Column(Integer, nullable=False)   # Changed from UUID
    user_id = Column(Integer, nullable=False)    # Changed from UUID
    amount = Column(Float, nullable=False)
    currency = Column(String, default="INR")
    status = Column(Enum(PaymentStatus), nullable=False)
    gateway_reference = Column(String, nullable=True)
