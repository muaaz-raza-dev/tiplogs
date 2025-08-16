from utils.response import Respond
from typing import List,Union

def AuthorizeRole(role_to_allow: Union[str | List[str]],user_role:str ):
    if isinstance(role_to_allow, str):
        role_to_allow = [role_to_allow]
        
    if user_role not in role_to_allow:
        return Respond(status_code=401, message="You are unauthorized to make this request")
    
    
    return None
    