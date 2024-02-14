from fastapi import APIRouter, Form, File, UploadFile, Request, HTTPException
from typing import Union, Annotated
from pymongo import MongoClient
from dotenv import load_dotenv
from bson.json_util import dumps
from bson.objectid import ObjectId
import os, json, datetime
from models.media_models import Create_Request

router = APIRouter(prefix="/api/media", tags=["media"])

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))

client = MongoClient(os.environ["db_address"])
db = client.RequestBoard

@router.get("/")
def get_request():
    request_list = db.media.find().sort("_id", -1)
    return {"data": json.loads(dumps(request_list))}

# @router.post("/")
# def requset_regist(dead_line: str = Form(), requester: str = Form(), belong: str = Form(),
#                    customer: str = Form(), category: str = Form(), range: str = Form(), detail: str = Form()):
    
#     print(dead_line, requester, belong, customer, category, range, detail)
#     return

@router.post("/")
async def requset_regist(request: Request, file: Union[UploadFile, None] = None):
    form_data = await request.form()
    print(file)
    try:
        check = Create_Request(**form_data)
    
    except Exception as Error:
        raise Error
    # print("...")
    # print(file)
    # print("...")
    # print(check)
    return