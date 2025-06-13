from fastapi import FastAPI, HTTPException, Path, Depends, Security
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, UUID4, Field, HttpUrl
from uuid import uuid4
from datetime import date
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt 
from enum import Enum
import requests  # to make HTTP requests to the Order Service
from sqlalchemy.orm import Session
from models import Shipment, ShippingStatus, Base
from database import engine, SessionLocal
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
app = FastAPI(title="Shipping Service API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JWT-based security for user-facing endpoints
security = HTTPBearer()

# Initialize the database
Base.metadata.create_all(bind=engine)

# Dependency to interact with the database
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Schemas
class CreateShippingRequest(BaseModel):
    orderId: int
    userId: int
    address: str

class CreateShippingResponse(BaseModel):
    trackingId: UUID4
    orderId: int
    status: ShippingStatus

class ShippingDetailsResponse(BaseModel):
    trackingId: UUID4
    orderId: int
    status: ShippingStatus
    estimatedDelivery: date
    trackingSiteLink: HttpUrl

class UpdateStatusRequest(BaseModel):
    status: ShippingStatus

class UpdateStatusResponse(BaseModel):
    trackingId: UUID4
    orderId: int
    status: ShippingStatus

class DeliveryConfirmationRequest(BaseModel):
    orderId: int
    status: ShippingStatus

class DeliveryConfirmationResponse(BaseModel):
    orderId: int
    status: ShippingStatus
    message: str

# Dependency: JWT-based user verification (only for GET endpoint)
def get_current_user(token: HTTPAuthorizationCredentials = Security(security)):
    if not token or not token.credentials:
        raise HTTPException(status_code=403, detail="Invalid token")
    
    try:
        payload = jwt.decode(token.credentials, "your-secret-key", algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=403, detail="Invalid token")

# Public/user-facing: Requires JWT
@app.get("/shipping/{trackingId}", response_model=ShippingDetailsResponse)
def get_shipping_details(trackingId: UUID4, user=Depends(get_current_user),db: Session = Depends(get_db)):
    shipment = db.query(Shipment).filter(Shipment.tracking_id == trackingId).first()
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipping record not found")
    return ShippingDetailsResponse(
    trackingId=shipment.tracking_id,
    orderId=shipment.order_id,
    status=shipment.status,
    estimatedDelivery=shipment.estimated_delivery,
    trackingSiteLink=shipment.tracking_site_link
)

# Internal-use endpoints: No JWT required
@app.post("/shipping", response_model=CreateShippingResponse)
def create_shipping(req: CreateShippingRequest,db: Session = Depends(get_db)):
    tracking_id = uuid4()
    shipment = Shipment(
        tracking_id=tracking_id,
        order_id=req.orderId,
        status=ShippingStatus.Pending,
        estimated_delivery=date.today().replace(day=date.today().day + 5),
        tracking_site_link=f"http://example.com/track/{tracking_id}"
    )
    db.add(shipment)
    db.commit()
    db.refresh(shipment)
    return CreateShippingResponse(
    trackingId=shipment.tracking_id,
    orderId=shipment.order_id,
    status=shipment.status
)

@app.patch("/shipping/{trackingId}/status", response_model=UpdateStatusResponse)
def update_status(trackingId: UUID4, req: UpdateStatusRequest,db: Session = Depends(get_db)):
    shipment = db.query(Shipment).filter(Shipment.tracking_id == trackingId).first()
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipping record not found")
    shipment.status = req.status
    db.commit()
    db.refresh(shipment)
    return UpdateStatusResponse(
        trackingId=trackingId,
        orderId=shipment.order_id,
        status=shipment.status
    )

@app.post("/orders/delivery-confirmation", response_model=DeliveryConfirmationResponse)
def confirm_delivery(req: DeliveryConfirmationRequest,db: Session = Depends(get_db)):
    if req.status != ShippingStatus.Delivered:
        raise HTTPException(status_code=400, detail="Only 'Delivered' status is allowed")
    
    # Notify Order Service (assuming it's running on localhost:8082)
    order_service_url = "http://localhost:8082/orders/delivery-confirmation"  # Order service endpoint
    order_payload = {
    "orderId": str(req.orderId),
    "status": req.status.value if isinstance(req.status, Enum) else str(req.status)
    }

    response = requests.post(order_service_url, json=order_payload)
    
    # Check if the notification was successful
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to notify Order Service about delivery")

    return DeliveryConfirmationResponse(
        orderId=req.orderId,
        status=req.status,
        message="Delivery confirmed and notified to Order Service."
    )
