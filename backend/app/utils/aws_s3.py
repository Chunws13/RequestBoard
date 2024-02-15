from dotenv import load_dotenv
import os, boto3

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))



def aws_s3_connection():
    try:
        s3_client = boto3.client(
                    "s3", 
                    region_name = "ap-northeast-2",
                    aws_access_key_id = os.environ["aws_s3_access_key"],
                    aws_secret_access_key = os.environ["aws_s3_secret_key"]
                )
    
    except Exception as error:
        print(error)
    
    else:
        return s3_client