from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException

def to_object_id(id_str: str) -> ObjectId:
    try:
        return ObjectId(id_str)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid ID format")
