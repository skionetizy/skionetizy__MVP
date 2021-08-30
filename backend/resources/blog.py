from flask import make_response,jsonify
from flask.globals import request
from flask_restful import Resource
import json
from bson import json_util

from cloudinary.uploader import upload
from cloudinary.utils import cloudinary_url
import pandas as pd
from backend.database.models import Blog,Comment,Profile
from backend import client
from backend.resources.gads import gads
from datetime import datetime
import uuid

class AddBlogDescriptionAndTitle(Resource):
    def post(self):
        body = request.get_json()
        print(f"body: {body}")
        if len(body["blogTitle"])<=6:
            return make_response(jsonify({"message":"blog title must be more than 6 characters long","statusCode":500,"success":False}))
        elif len(body["blogDescription"])<=200:
            return make_response(jsonify({"message":"blog description must be more than 200 characters long","statusCode":500,"success":False}))

        
        newBlog= Blog(
            blogID = uuid.uuid4(),
            blogTitle=body["blogTitle"],
            blogDescription=body["blogDescription"],
            profileID=body["profileID"]
        )

        newBlog.save()

        return make_response(jsonify({"blog":newBlog,"statusCode":201,"success":True}))

class UpdateBlogDescriptionAndText(Resource):
    def patch(self):
        body = request.get_json()

        blogID = body["blogID"]
        
        blog = Blog.objects.get(blogID=blogID)
       
        profileID=body['profileID']
        # if(userID!= blog['userID']):
        #     return make_response(jsonify({"message":"you are not authorised to update this blog","statusCode":500}))

        blog.update(
            blogTitle=body["blogTitle"],
            blogDescription=body["blogDescription"]
        )
        blog.save()

        return make_response(jsonify({"blog":blog,"statusCode":200,"success":True}))
    
class AddBlogImage(Resource):
    def patch(self):
        blogID = request.form['blogID']
        profileID=request.form['profileID']
        # print(blogID)
        blog = Blog.objects.get(blogID= blogID)
        photo = request.files["file"]
        # if(userID!= blog['userID']):
        #     return make_response(jsonify({"message":"you are not authorised to update this blog","statusCode":500}))

        upload_result = upload(photo)
        photo_url,options=cloudinary_url(
            upload_result['public_id']
        )

        current_datetime = datetime.now()
        # print(type(photo_url))
        # print(photo_url)
        # print(current_datetime)
        
        blog.update(
            blogImageURL=photo_url,
            timestamp= current_datetime
        )
        # return make_response(jsonify(upload_result,photo_url,options))
        return make_response(jsonify({"blog":blog,"statusCode":200,"success":True}))

        
class LikeOnBlog(Resource):
    def patch(self,blogID,profileID):
        # body = request.get_json()
        # userID=body["userID"]
        # blogID=body["blogID"]
        print(f"blogID : {blogID}")
        print(f"userID: {profileID}")

        
        blog=Blog.objects.get(blogID=blogID)

        # if(userID!= blog['userID']):
        #     return make_response(jsonify({"message":"you are not authorised to update this blog","statusCode":500}))

        # print(blog["likedByUsersList"])
        
        if(len(blog['likedByUsersList'])==0):
            blog.update(
                likedByUsersList=[]
            )
        
        # print(blog['likesCount'])
        newLikesCount=blog['likesCount']+1
        # print(newLikesCount)
        # newUserWhoLiked  = body['userID']
        newUserWhoLiked  = profileID
        newLikedByUsersList= blog['likedByUsersList'].append(newUserWhoLiked)
        blog.update(
            likesCount= newLikesCount,
            likedByUsersList=newLikedByUsersList,
            # hasLiked = True
        )
        blog.save()
        
        return make_response(jsonify({"message":"you have successfully liked the blog","statusCode":"200","blog":blog,"success":True}))


def changeUUIDtoString(uuidVar):
    newUUIDVar=uuidVar.hex
    return newUUIDVar

def changeUUIDtoString2(uuidVar):
    newUUIDStr = str(uuidVar)
    return newUUIDStr

    
class RemoveLikeOnBlog(Resource):
    def patch(self,blogID,profileID):
        # body=request.get_json()
        # blogID = body['blogID']
        # userID=body['userID']
        blog =Blog.objects.get(blogID=blogID)

        likedByUsersList = blog['likedByUsersList']
        # print(likedByUsersList)
        for user in likedByUsersList:
            # newUser = changeUUIDtoString(user)
            newUser = changeUUIDtoString2(user)

            # print(f"user : {user}" )
            # print(f"userID :{userID}")
            # print(f"user type: {type(user)}")
            # print(f"userID type: {type(userID)}")
            if(newUser == profileID):
                # print("entered")
                print(newUser)
                likedByUsersList.remove(user)
                blog.update(
                    likesCount=blog['likesCount']-1,
                    # hasLiked = False
                )
        
        blog.save()
        
        return make_response(jsonify({"message":"you have successfully removed your  like on the blog","statusCode":"200","blog":blog,"success":True}))


class DislikeOnBlog(Resource):
    def patch(self,blogID,profileID):
        # body = request.get_json()
        # userID=body["userID"]
        # blogID=body["blogID"]
        # print(blogID)
        blog=Blog.objects.get(blogID=blogID)

        # if(userID!= blog['userID']):
        #     return make_response(jsonify({"message":"you are not authorised to update this blog","statusCode":500}))
        
        if(len(blog['dislikedByUsersList'])==0):
            blog.update(
                dislikedByUsersList=[]
            )
        
        # print(blog['likesCount'])
        newDislikesCount=blog['dislikesCount']+1
        # print(newLikesCount)
        # newUserWhoDisliked  = body['userID']
        newUserWhoDisliked = profileID
        newDislikedByUsersList= blog['dislikedByUsersList'].append(newUserWhoDisliked)
        output1= blog.update(
            dislikesCount= newDislikesCount,
            dislikedByUsersList=newDislikedByUsersList,
            # hasDisliked = True
        )
        print(f"output1 : {output1}")
        output2= blog.save()
        print(f"output2 : {output2}")
        # sampleListItem="hello"
        # sampleList=blog['sampleList'].append(sampleListItem)
        # blog.update(
        #     sampleList=sampleList
        # )
        # blog.save()
        
        return make_response(jsonify({"message":"you have successfully dis liked the blog","statusCode":"200","blog":blog,"success":True}))

class RemoveDislikeOnBlog(Resource):
    def patch(self,blogID,profileID):
        # body=request.get_json()
        # blogID = body['blogID']
        # userID=body['userID']
        blog =Blog.objects.get(blogID=blogID)
        print(f"blog {blog}")

        dislikedByUsersList = blog['dislikedByUsersList']
        print(f"dislikedByUsersList {dislikedByUsersList}")
        for user in dislikedByUsersList:
            newUser = changeUUIDtoString2(user)
            # print(f"user {user}")
            # print(f"newUser {newUser}")
            # print(f"userID {userID}")
            # print(type(newUser))
            # print(type(userID))
            if(newUser == profileID):
                print(f"newUser {newUser}")
                dislikedByUsersList.remove(user)
                print(f"dislikedByUsersList after removing {dislikedByUsersList} ")
                blog.update(
                    dislikesCount=blog['dislikesCount']-1,
                    # hasDisliked = False
                )
        
        blog.save()
        
        return make_response(jsonify({"message":"you have successfully removed your dis like on the blog","statusCode":"200","blog":blog,"success":True}))

class AddCommentToBlog(Resource):
    def patch(self):
        body=request.get_json()
        commentID=uuid.uuid4()
        profileID=body['profileID']
        blogID=body['blogID']
        commentDescription=body['commentDescription']
        blog=Blog.objects.get(blogID=blogID)
        # if(userID!= blog['userID']):
        #     return make_response(jsonify({"message":"you are not authorised to update this blog","statusCode":500}))
        if(len(commentDescription)>=300 or len(commentDescription)<6):
            return make_response(jsonify({"message":"comment must be more than 6 characters and less than 300 characters"}))
        comment=Comment(
            commentID=commentID,
            commentDescription=commentDescription,
            blogID=blogID,
            profileID=profileID
        )
        # comment.save()
        comments=blog['comments']
        newComments=comments.append(comment)
        blog.update(
            comments=newComments
        )
        blog.save()
        return make_response(jsonify({"message":"you have successfully added comment on the    blog","statusCode":"200","comment":comment,"success":True}))

class RemoveCommentonBlog(Resource):
    def patch(self):
        body=request.get_json()
        print(f"body {body}")
        commentID=body['commentID']
        profileID=body['profileID']
        blogID=body['blogID']
    
        blog=Blog.objects.get(blogID=blogID)

        # if(userID!= blog['userID']):
        #     return make_response(jsonify({"message":"you are not authorised to update this blog","statusCode":500}))

        # comment.save()
        
        comments=blog['comments']
        
        for comment in comments:
            print(comment)
            # newComment = changeUUIDtoString(comment['commentID'])
            newComment = changeUUIDtoString2(comment['commentID'])
            if(commentID == newComment):
                comments.remove(comment)
            
        blog.save()
        return make_response(jsonify({"message":"you have successfully added comment on the    blog","statusCode":"200","blog":blog,"success":True}))

class GetBlogsAndProfileDetails(Resource):
    def get(self):
        # blogs=Blog.objects().exclude("blogDescription","comments","likedByUsersList","dislikedByUsersList")
        blogs=Blog.objects().exclude("comments","likedByUsersList","dislikedByUsersList")
        blogs=[x.to_mongo().to_dict() for x in blogs]
        for i in blogs:
            p=Profile.objects.get(profileID=i['profileID'])
            i['profilePicImageURL']=p.profilePicImageURL
            i['profileName']=p.profileName
        return make_response(jsonify({"blogs":json.loads(json_util.dumps(blogs)),"success":True}))

class GetBlogsByProfile(Resource):
    # def get(self,profileID):
    def get(self,profileUserName):
        # body=request.get_json()
        # userID=body['userID']
        # profile = Profile.objects.get(profileID=profileID)
        profile = Profile.objects.get(profileUserName=profileUserName)
        blogsByUser=Blog.objects(profileID=profile["profileID"])
        # blogsByUser=Blog.objects(userID=userID)
        return make_response(jsonify({"blogs":blogsByUser,"statusCode":200,"success":True}))

class GetBlogByBlogID(Resource):
    def get(self,blogID):
        # body=request.get_json()
        blog = Blog.objects.get(blogID=blogID)
        profile=Profile.objects.get(profileID=blog['profileID'])
        blog=blog.to_mongo().to_dict()
        blog['profilePicImageURL']=profile.profilePicImageURL
        blog['profileName']=profile.profileName
        return make_response(jsonify({"blog":json.loads(json_util.dumps(blog)),"statusCode":200,"success":True}))


class GetFeed(Resource):
    def get(self,profileID):
        profile=Profile.objects.get_or_404(profileID=profileID)
        profile_following=profile.Following
        blogs=[]
        print(profile_following[0])
        for i in list(profile_following):
            p=Profile.objects.get_or_404(profileID=i)
            b=Blog.objects(profileID=p.profileID).exclude("comments","likedByUsersList","dislikedByUsersList")
            b=[x.to_mongo().to_dict() for x in b]
            for k in b:
                k['profilePicImageURL']=p.profilePicImageURL
                k['profileName']=p.profileName
            blogs.extend(b)
        blogs.sort(key=lambda x:x['timestamp'],reverse=True)
        return jsonify({'blogs':json.loads(json_util.dumps(blogs)),"success":True})

class AddView(Resource):
    def patch(self,blogID):
        blog=Blog.objects.get_or_404(blogID=blogID)
        blog.viewCount+=1
        blog.save()
        return jsonify({"status_code":200,"success":True})
        
class GetCommentsByBlogID(Resource):
    def get(self,blogID):
        blog=Blog.objects.get_or_404(blogID=blogID)
        p=Profile.objects.get_or_404(profileID=blog.profileID)
        comments=blog.comments
        comments=[x.to_mongo().to_dict() for x in comments]
        for x in comments:
            x['profilePicImageURL']=p.profilePicImageURL
            x['profileName']=p.profileName
        return jsonify({'comments':json.loads(json_util.dumps(comments)),'status_code':200,'success':'true'})


class AddKeywordsBlog(Resource):
    def get(self,word):
        l=[]
        l.append(str(word))
        list_keywords= gads(client, "5304812837", ["2840"], "1000",l, None)
        list_to_excel = []
        for x in range(len(list_keywords)):
            list_months = []
            list_searches = []
            list_annotations = []
            for y in list_keywords[x].keyword_idea_metrics.monthly_search_volumes:
                list_months.append(str(y.month)[12::] + " - " + str(y.year))
                list_searches.append(y.monthly_searches)
                
            for y in list_keywords[x].keyword_annotations.concepts:
                list_annotations.append(y.concept_group.name)
            list_to_excel.append([list_keywords[x].text, list_keywords[x].keyword_idea_metrics.avg_monthly_searches, str(list_keywords[x].keyword_idea_metrics.competition)[28::], list_keywords[x].keyword_idea_metrics.competition_index, list_searches, list_months, list_annotations ])
        data=pd.DataFrame(list_to_excel, columns = ["Keyword", "Average Searches", "Competition Level", "Competition Index", "Searches Past Months", "Past Months", "List Annotations"])
        # print(data)
        return make_response(jsonify({'data':data.head().to_dict()}))


class GetBlogsAndProfileDetailsPagination(Resource):
    def get(self,number):
        blogs=Blog.objects().exclude("comments","likedByUsersList","dislikedByUsersList")
        blogs=[x.to_mongo().to_dict() for x in blogs]
        for i in blogs:
            p=Profile.objects.get(profileID=i['profileID'])
            i['profilePicImageURL']=p.profilePicImageURL
            i['profileName']=p.profileName
        blogs_paginated=[]
        index=0
        i=0
        temp=[]
        for i in blogs:
            if len(temp)==5:
                blogs_paginated.append(temp)
                temp=[]
            else:
                temp.append(i)
        blogs_paginated.append(temp)
        if(len(blogs_paginated)<number or number<0):
            return make_response(jsonify({'message':'exceeded bounds'}), 404)

        return make_response(jsonify({"blogs":json.loads(json_util.dumps(blogs_paginated[number])),"success":True}))