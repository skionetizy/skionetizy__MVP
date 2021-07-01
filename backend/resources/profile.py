from flask import make_response,jsonify
from flask.globals import request
from flask_restful

import uuid 

from cloudinary.uploader import upload
from cloudinary.utils import cloudinary_url

from database.models import Profile 

# from datetime import datetime

class AddProfileDescriptionTitleAndUsername(Resource):
    def post(self):
        body = request.get_json()

        if len(body["profileBio"]>300):
            return make_response(jsonify({"message":"Profile Bio must be less than 300 characters","success":False}))
        if len(body["profileUserName"]>15):
            return make_response(jsonify({"message":"Profile Username must be less than 15 characters","success":False}))

        tempProfileName = body["firstName"]+ " " + body["lastName"]
        newProfile = Profile(
            profileID = uuid.uuid4(),
            userID = body["userID"],
            profileName = tempProfileName,
            profileUserName = body["profileUserName"]
        )
        
        newProfile.save()

        return make_response(jsonify({"profile":newProfile,"statusCode":201,"success":True}))
    
class UpdateProfile(Resource):
    def patch(self):
        body = request.get_json()

        profileID = body["profileID"]
        userID = body["userID"]

        profile = Profile.objects.get(profileID = profileID)
        profilePicImage = request.files["profilePicImage"]
        profileBannerImage = request.files["profileBannerImage"]

        upload_result_profile_pic = upload(profilePicImage)
        upload_result_profile_banner = upload(profileBannerImage)

        photo_url,options=cloudinary_url(
            upload_result_profile_pic['public_id']
        )
        profilePicImageURL=photo_url

        photo_url,options=cloudinary_url(
            upload_result_profile_banner['public_id']
        )
        profileBannerImageURL= photo_url

        profile.update(
            profileBannerImageURL=profileBannerImageURL,
            profilePicImageURL=profilePicImageURL,
            profileWebsiteURL = body["profileWebsiteURL"],
            profileBio =body["profileBio"],

        )

        return make_response(jsonify({"profile":profile,"statusCode":200,"success":True}))

    

