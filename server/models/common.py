from enum import Enum

class UserRole(str, Enum):
    admin = "admin"
    staff = "staff"
    manager = "manager"