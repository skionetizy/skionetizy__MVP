from flask import json, make_response,jsonify
from flask.globals import request
from flask_restful import Resource

import uuid 

from cloudinary.uploader import upload
from cloudinary.utils import cloudinary_url

from backend.database.models import Profile,Blog

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
        if ' ' in body["profileUserName"]:
            return make_response(jsonify({'message':'Profile Name Should Not Include WhiteSpaces','success':False}))
        if body["profileGender"] not in ["MALE","FEMALE","OTHERS"]:
            return make_response(jsonify({"message":"Provided Gender Details Not In Right Format","success":False}))

      

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
            profileBio= body["profileBio"],
            profileGender=body['profileGender']
        )
        
        newProfile.save()

        return make_response(jsonify({"profile":newProfile,"statusCode":201,"success":True}))
    
class UpdateProfile(Resource):
    def patch(self,profileID):
        # print(f"request.form {request.form} ")
        # print(f"request.files {request.files}")
        body = request.form.to_dict()
        #### Had to use request.form instead of request.json for the profile data to be fetched
        ### Guess not possibleto send photo in json
        
        profile = Profile.objects.get(profileID = profileID)
        try:
            profilePicImage = request.files["profilePicImage"]
            upload_result_profile_pic = upload(profilePicImage)
            photo_url1,options=cloudinary_url(
            upload_result_profile_pic['public_id']
            )
            profilePicImageURL=photo_url1
            photo_url1='https'+photo_url1[4:]
            body["profilePicImageURL"]=photo_url1
        except:
            pass
        try:
            profileBannerImage = request.files["profileBannerImage"]
            upload_result_profile_banner = upload(profileBannerImage)
            photo_url2,options=cloudinary_url(
            upload_result_profile_banner['public_id']
            )
            profileBannerImageURL= photo_url2
            photo_url2='https'+photo_url2[4:]
            body["profileBannerImageURL"]=photo_url2
        except:
            pass    
        k=profile.update(
            **body
        )
        return make_response(jsonify({"profile":k,"statusCode":200,"success":True}))

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

class RemoveFollower(Resource):
    def patch(self,profileID):
        #profileID here is the profileID of the current user
        body=request.get_json()
        to_remove_from_following=body['to_remove_from_following']
        current_user=Profile.objects.get_or_404(profileID=to_remove_from_following)
        other_user=Profile.objects.get_or_404(profileID=profileID)
        if(current_user.profileID==other_user.profileID):
            return make_response(jsonify({'Message':'Method Not allowed'}))
        print(other_user.Followers)
        print(current_user.Following)
        if(other_user.profileID not in current_user.Following):
            return make_response(jsonify({'Message':'Cannot Unfollow a person you dont follow'}))
        k=other_user.Followers
        k.remove(current_user.profileID)
        other_user.update(Followers=k)
        other_user.FollowersCount-=1
        other_user.save()
        k=current_user.Following
        k.remove(other_user.profileID)
        current_user.update(Following=k)
        current_user.FollowingCount-=1
        current_user.save()
        return make_response(jsonify({'Message':'Successfully Committed Changes'}))



class AddFollower(Resource):
    def patch(self,profileID):
        body=request.get_json()
        to_follow_pid=body["to_follow_id"]
        profile=Profile.objects.get_or_404(profileID=to_follow_pid)
        prof=Profile.objects.get_or_404(profileID=profileID)
        print(profile.Followers)
        if(prof.profileID==profile.profileID):
            return make_response(jsonify({'Message':'Method Not allowed'}))
        if prof.profileID in profile.Followers:
            return make_response(jsonify({'Message':'Already Following'}))
        profile.Followers.append(profileID)
        profile.FollowersCount=profile.FollowersCount+1
        prof.Following.append(to_follow_pid)
        prof.FollowingCount=prof.FollowingCount+1
        print(f"I am adding to my following: {prof.Following} ,  That Guys account has  follower {profile.Followers}")
        profile.save()
        prof.save()
        return jsonify({'profile':profile})

class GetBlogsAndProfile(Resource):
    def get(self,profileUserName):
        profileID = Profile.objects.get(profileUserName=profileUserName)
        blogs=Blog.objects(profileID=profileID)
        profile=Profile.objects.get(profileID=profileID)
        return jsonify({'blogs':blogs,'profile':profile,'success':True,'status':200})