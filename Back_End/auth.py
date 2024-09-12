from passlib.context import CryptContext
import jwt
from fastapi.security import OAuth2PasswordBearer
from typing import Optional
from schemas import User
from fastapi import HTTPException,Depends

SECRET_KEY = "test"
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

fake_users_db = {
    "best": {
        "username": "best",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "role": "user",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
        "disabled": False,
    }
}

fake_users_db2 = {
    "feel": {
        "username": "feel",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "role": "admin",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
        "disabled": False,
    }
}






def authenticate(username: str, password: str) -> Optional[dict]:
    user = fake_users_db.get(username)
    admin = fake_users_db2.get(username)
    data = user or admin
    if not data:
        return None
    if not verify_password(password, data["hashed_password"]):
        return None
    return data

def verify_password(password: str, hash_password: str) -> bool:
    return pwd_context.verify(password, hash_password)

def cerate_token(username: str, role: str) -> str:
    payload = {"username": username, "role": role}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        role = payload.get("role")
        username = payload.get("username")
        if role == "admin":
            data = fake_users_db2.get(username)
        elif role == "user":
            data = fake_users_db.get(username)
        else:
            raise HTTPException(status_code=403, detail="Invalid role")
        if data is None:
            raise HTTPException(status_code=404, detail="User not found")
        return User(username=data["username"], name=data["full_name"], role=data["role"])
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    

