from typing import List
from pydantic import BaseModel 

class Product(BaseModel):
    name: str
    price: float
    stock:int
    
    
class ShowProduct(BaseModel):
    id:int
    name:str
    price:float
    stock:int
    class Config():#since sqlalchemy uses orm
        orm_mode=True