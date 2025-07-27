from utils.response import Respond


def AuthorizeRole(role_to_allow: str ,user_role:str ):
    if user_role != role_to_allow :
        return Respond(status_code=401,message="You are unauthorized to make this request")
    else :
        return None
    