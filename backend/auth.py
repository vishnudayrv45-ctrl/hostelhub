import os

from dotenv import load_dotenv
from passlib.context import CryptContext
from jose import JWTError, jwt

load_dotenv()


# -------------------------
# PASSWORD HASHING
# -------------------------

pwd_context = CryptContext(
    schemes=["pbkdf2_sha256"],
    deprecated="auto"
)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:
    return pwd_context.verify(
        plain_password,
        hashed_password
    )


# -------------------------
# JWT CONFIGURATION
# -------------------------

SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "HostelHub_Secret_Key_2026"
)

ALGORITHM = os.getenv(
    "ALGORITHM",
    "HS256"
)

ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv(
        "ACCESS_TOKEN_EXPIRE_MINUTES",
        "60"
    )
)


# -------------------------
# CREATE JWT TOKEN
# -------------------------

def create_access_token(
    user_id: int,
    email: str,
    role: str
):

    from datetime import datetime, timedelta

    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": str(user_id),
        "email": email,
        "role": role,
        "exp": expire
    }

    token = jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token


# -------------------------
# VERIFY JWT TOKEN
# -------------------------

def verify_token(token: str):

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload

    except JWTError as e:

        print("JWT ERROR:", str(e))

        return None