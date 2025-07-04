from passlib.context import CryptContext

def Hash(string:str) -> str:
    hash_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    hashed_string = hash_context(string)
    return hashed_string 

def VerifyHash(hashed_string:str,plain_string:str)->bool :
    hash_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    is_valid = hash_context.verify(plain_string,hashed_string )
    return is_valid


