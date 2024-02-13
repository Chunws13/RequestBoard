from fastapi import APIRouter
from pymongo import MongoClient
from dotenv import load_dotenv
from bson.json_util import dumps
from bson.objectid import ObjectId
import os, json, datetime

from models.tech_models import Create_Request, Adjust_Status

router = APIRouter(prefix="/api/tech", tags=["tech"])

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))

client = MongoClient(os.environ["db_address"])
db = client.RequestBoard

@router.get("/")
def get_request():
    request_list = db.tech.find().sort("_id", -1)
    return {"data": json.loads(dumps(request_list))}

@router.post("/")
def request_regist(Create_Request: Create_Request):
    year, month, day = map(int, Create_Request.dead_line.split("."))

    request_data = { 
                    "request_date": datetime.datetime.now(),
                    "dead_line": datetime.datetime(year, month, day),  
                    "requester": Create_Request.requester,
                    "belong": Create_Request.belong,
                    "customer": Create_Request.customer,
                    "stack": Create_Request.stack,
                    "reference": Create_Request.reference,
                    "detail": Create_Request.detail,
                    "status": "처리중"
                    }
    
    db.tech.insert_one(request_data)
    return json.loads(dumps(request_data))

@router.put("/")
def adjust_status(id: str, Adjust_Status: Adjust_Status):
    db.tech.update_one({"_id": ObjectId(id)} ,
                        {"$set": { 
                            "status": Adjust_Status.status 
                        }}
                    )
    
    update_data = db.tech.find_one({"_id": ObjectId(id)})
    
    return json.loads(dumps(update_data))