from flask import make_response,jsonify
from flask.globals import request
from flask_restful import Resource

import uuid 

from cloudinary.uploader import upload
from cloudinary.utils import cloudinary_url

from backend.database.models import Profile

# from datetime import datetime

class AddProfileUsernameBioUserDetails(Resource):
    def post(self):
        body = request.get_json()
        # print(f"body: {body['userID']}")
        profileBio=body
        print(f"profileBio: {profileBio}")

        if len(body["profileBio"])>300:
            return make_response(jsonify({"message":"Profile Bio must be less than 300 characters","success":False}))
        if len(body["profileUserName"])>15:
            return make_response(jsonify({"message":"Profile Username must be less than 15 characters","success":False}))

      

        tempProfileUserName =  body["profileUserName"]
        # isProfileExisting = Profile.objects.get(profileUserName=tempProfileUserName)
        # if(isProfileExisting):
        #     return make_response(jsonify({"message":"username already exists, try another username","statusCode":500}))

        tempProfileName = body["firstName"]+ " " + body["lastName"]
        newProfile = Profile(
            profileID = uuid.uuid4(),
            userID = body["userID"],
            profileName = tempProfileName,
            profileUserName = body["profileUserName"],
            profileBio= body["profileBio"]
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

class GetProfileDetails(Resource):
    # def get(self,profileID):
    def get(self,profileUserName):
        # profile = Profile.objects.get(profileID=profileID)
        profile = Profile.objects.get(profileUserName=profileUserName)
        return make_response(jsonify({"profile":profile,"statusCode":200,"success":True}))

class CheckProfileUsernameIsAvailableAPIHandler(Resource):
    def post(self):
        body= request.get_json()
        profileUserName=body["profileUserName"]
        isProfileExisting =  Profile.objects(profileUserName=profileUserName) 
        if(isProfileExisting):
            return  make_response(jsonify({"message":f"profile User Name  {profileUserName}  already exists ,try again","statusCode":500,"success":False}))
        else:
            return make_response(jsonify({"message":f"profile user name {profileUserName} is available","statusCode":200,"success":True}))
        





    

