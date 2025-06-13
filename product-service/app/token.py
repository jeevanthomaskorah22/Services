from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from datetime import datetime

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

SECRET_KEY = "ith-oru-rahasyama"
ALGORITHM = "HS256"

credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)

def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        print("Verifying token...")
        print(f"Token: {token}")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        exp_timestamp = payload.get("exp")
        if exp_timestamp is None or datetime.utcfromtimestamp(exp_timestamp) < datetime.utcnow():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if "sub" not in payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token payload missing subject",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return payload

    except JWTError:
        raise credentials_exception
