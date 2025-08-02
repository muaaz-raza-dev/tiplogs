from fastapi import APIRouter, File, UploadFile, Depends
from middleware.authorization import authorize_user
from utils.response import Respond
import cloudinary.uploader
from bson import ObjectId
from models.Individual import Individual

router = APIRouter(prefix="/general")

@router.post("/photo/cloud/{id}")
async def UploadPhotoToCloudinary(
    id: str,
    file: UploadFile = File(...),
    user=Depends(authorize_user)
):
    if not file.content_type.startswith("image/"):
        return Respond(
            message="Invalid image file, only .png, .jpg and .jpeg are allowed",
            status_code=400
        )

    try:
        if not ObjectId.is_valid(id):
            return Respond(message="Invalid ID", status_code=422)

        individual = await Individual.find(
            Individual.id == ObjectId(id),
            Individual.organization.id == ObjectId(user["organization"])
        ).first_or_none()

        if not individual:
            return Respond(message="Individual not found", status_code=404)

        result = cloudinary.uploader.upload(
            file.file,
            folder="tiplogs/images",
            public_id=None,  # You can set a custom ID here if needed
            overwrite=True,
            resource_type="image"
        )

        individual.photo = result["secure_url"]
        await individual.save()

        return Respond(payload={"url": result["secure_url"]})

    except Exception as e:
        print("Cloudinary Upload Error:", e)
        return Respond(message="Internal server error", status_code=500)
