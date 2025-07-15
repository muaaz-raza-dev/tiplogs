from passlib.context import CryptContext

hash_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def Hash(string:str) -> str:
    hashed_string = hash_context.hash(string)
    return hashed_string 

def VerifyHash(hashed_string:str,plain_string:str)->bool :
    is_valid = hash_context.verify(plain_string,hashed_string )
    return is_valid


