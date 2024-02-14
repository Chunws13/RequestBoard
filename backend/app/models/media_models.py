from pydantic import BaseModel

class Create_Request(BaseModel):
    dead_line: str
    requester: str
    belong: str
    customer: str
    category: str
    range: str
    detail: str