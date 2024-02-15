from fastapi import APIRouter, Form, File, UploadFile, Request, HTTPException
from typing import Union, Annotated
from pymongo import MongoClient
from utils.aws_s3 import aws_s3_connection
from dotenv import load_dotenv
from bson.json_util import dumps
from bson.objectid import ObjectId
import os, json, datetime, io, uuid, mimetypes
from models.media_models import Create_Request

router = APIRouter(prefix="/api/media", tags=["media"])

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))

client = MongoClient(os.environ["db_address"])
db = client.RequestBoard

S3 = aws_s3_connection()

@router.get("/")
def get_request():
    request_list = db.media.find().sort("_id", -1)
    return {"data": json.loads(dumps(request_list))}


@router.post("/")
async def requset_regist(request: Request, file: Union[UploadFile, None] = None):
    form_data = await request.form()
        
    try:
        convert_form_data = Create_Request(**form_data)
    
    except Exception as Error:
        raise Error
    
    save_file_name = ''

    if file:
        filename, extension = os.path.splitext(file.filename)
        
        file_data = await file.read()

        file_to_bytes = io.BytesIO(file_data)
        unique_file_name = str(uuid.uuid4())
        save_file_name = "{file_name}.{extension}".format(file_name = unique_file_name, extension = extension)
        
        S3.upload_fileobj(file_to_bytes, "blorange", "media/{save_file_name}".format(save_file_name = save_file_name), ExtraArgs={'ContentType': file.content_type})
    
    year, month, day = map(int, convert_form_data.dead_line.split("."))

    request_data = {
                    "request_date": datetime.datetime.now(),
                    "dead_line" : datetime.datetime(year, month, day),
                    "requester": convert_form_data.requester,
                    "belong": convert_form_data.belong,
                    "customer": convert_form_data.customer,
                    "category": convert_form_data.category,
                    "range": convert_form_data.range,
                    "detail": convert_form_data.detail,
                    "status": "처리중",
                    "file": save_file_name
                    }
    
    db.media.insert_one(request_data)

    return json.loads(dumps(request_data))