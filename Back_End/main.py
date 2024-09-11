from fastapi import FastAPI, Depends, HTTPException
from auth import get_current_user, authenticate, cerate_token
from schemas import Token, User
from fastapi.security import OAuth2PasswordRequestForm

app = FastAPI()

@app.get("/")
async def welcome(user: User = Depends(get_current_user)):
    return user

@app.post("/login")
def login(login_form: OAuth2PasswordRequestForm = Depends()):
    data = authenticate(login_form.username, login_form.password)
    if not data:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    token = cerate_token(data["username"], data["role"])
    return Token(access_token=token, token_type="bearer")
