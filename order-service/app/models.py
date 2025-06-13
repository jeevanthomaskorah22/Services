from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    product_id = Column(Integer)
    quantity = Column(Integer)
    status = Column(String, default="pending")
    # created_at = Column(DateTime(timezone=True), server_default=func.now())

class CartItem(Base):
    __tablename__ = "cart_items"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer,nullable=False)
    product_id = Column(Integer,nullable=False)
    quantity = Column(Integer,nullable=False)