from fastapi import FastAPI, Request, Depends
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional
import os

from app.models import Order, Base, CartItem
from app.database import SessionLocal, engine, get_db
from app.routes import router

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

templates = Jinja2Templates(directory=os.path.join(os.path.dirname(__file__), "templates"))

@app.get("/", response_class=HTMLResponse)
def read_root(request: Request):
    return templates.TemplateResponse("home.html", {"request": request})

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.get("/orders")
async def get_orders(order_id: Optional[int] = None, db: Session = Depends(get_db)):
    if order_id:
        order = db.query(Order).filter(Order.id == order_id).first()
        if order:
            return {
                "order_id": order.id,
                "user_id": order.user_id,
                "product_id": order.product_id,
                "quantity": order.quantity
            }
        else:
            return {"error": f"Order with ID {order_id} not found"}
    else:
        orders = db.query(Order).all()
        return [
            {
                "order_id": o.id,
                "user_id": o.user_id,
                "product_id": o.product_id,
                "quantity": o.quantity
            }
            for o in orders
        ]
