from typing import List
from fastapi import APIRouter,Depends,status,HTTPException
from .. import schemas,models
from sqlalchemy.orm import Session
from ..database import get_db
from ..token import verify_token

router= APIRouter(
    prefix='/products',
    tags=['Products']
    )

@router.get('/',response_model=List[schemas.ShowProduct])
def all(db:Session =Depends(get_db), token: dict = Depends(verify_token)):
    products=db.query(models.Product).all()
    return products

@router.post('/',status_code=status.HTTP_201_CREATED)
def create(request :schemas.Product , db : Session =Depends(get_db),token: dict = Depends(verify_token) ):
    new_product= models.Product(name=request.name,price=request.price,stock=request.stock)
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

@router.delete('/{id}',status_code=status.HTTP_204_NO_CONTENT)
def destroy(id,db:Session=Depends(get_db),token: dict = Depends(verify_token)):
    product =db.query(models.Product).filter(models.Product.id==id)
    if not product.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail=f'product with id {id} is not available')
    product.delete(synchronize_session=False)
    db.commit()
    return 'done'

#update
@router.put('/{id}',status_code=status.HTTP_202_ACCEPTED)
def update(id,request: schemas.Product,db:Session=Depends(get_db),token: dict = Depends(verify_token)):
    product=db.query(models.Product).filter(models.Product.id==id)
    if not product.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail=f'product with id {id} is not available')
    
    product.update({"name":request.name,"price":request.price,"stock":request.stock},synchronize_session=False)
    db.commit()
    return 'updated'

@router.get('/{id}',status_code=200,response_model=schemas.ShowProduct)
def show(id:int,db:Session =Depends(get_db),token: dict = Depends(verify_token)):
    product=db.query(models.Product).filter(models.Product.id==id).first()
    #response is used for exception handling
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail=f'Product with the id {id} is not available')
        #responce.status_code=status.HTTP_404_NOT_FOUND
        #return{'detail':f'Product with the id {id} is not available'}
    return product


