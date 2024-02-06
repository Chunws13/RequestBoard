from pydantic import BaseModel

class Create_Request(BaseModel):
    dead_line: str
    requester: str
    belong: str
    customer: str
    stack: str
    reference: str
    detail: str

    