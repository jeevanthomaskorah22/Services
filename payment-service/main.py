from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from models import Base, Payment, PaymentStatus
from database import engine, SessionLocal
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from uuid import uuid4
import os
import requests

load_dotenv()

app = FastAPI(title="Payment Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Payment.__table__.drop(engine)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Updated Pydantic Schemas
class InitiatePaymentRequest(BaseModel):
    orderId: int
    userId: int
    amount: float
    currency: str = "INR"

class InitiatePaymentResponse(BaseModel):
    paymentId: str
    orderId: int
    gatewayPaymentUrl: str
    status: PaymentStatus

class PaymentWebhook(BaseModel):
    paymentId: str
    status: PaymentStatus
    gatewayReference: str

ORDER_SERVICE_URL = os.environ.get("ORDER_SERVICE_URL", "http://localhost:8002")

@app.post("/payments/initiate", response_model=InitiatePaymentResponse)
def initiate_payment(req: InitiatePaymentRequest, db: Session = Depends(get_db)):
    payment = Payment(
        order_id=req.orderId,
        user_id=req.userId,
        amount=req.amount,
        currency=req.currency,
        status=PaymentStatus.Initiated,
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)

    fake_gateway_url = f"https://mock.gateway/pay/{payment.payment_id}"

    return InitiatePaymentResponse(
        paymentId=payment.payment_id,
        orderId=payment.order_id,
        gatewayPaymentUrl=fake_gateway_url,
        status=payment.status
    )

@app.post("/payments/webhook")
def payment_webhook(webhook: PaymentWebhook, db: Session = Depends(get_db)):
    payment = db.query(Payment).filter(Payment.payment_id == webhook.paymentId).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    payment.status = webhook.status
    payment.gateway_reference = webhook.gatewayReference
    db.commit()

    try:
        response = requests.patch(
            f"{ORDER_SERVICE_URL}/orders/{payment.order_id}",
            json={"status": "Confirmed"} if webhook.status == PaymentStatus.Success else {"status": "Cancelled"}
        )
        if response.status_code != 200:
            raise Exception("Order service update failed")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to notify Order Service: {str(e)}")

    return {"message": "Payment status updated and Order Service notified."}
