from flask import make_response,jsonify
from flask.globals import request
from flask_restful import Resource


from cloudinary.uploader import upload
from cloudinary.utils import cloudinary_url

from database.models import Blog,Comment

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
            userID=body["userID"]
        )

        newBlog.save()

        return make_response(jsonify({"blog":newBlog,"statusCode":201,"success":True}))

class UpdateBlogDescriptionAndText(Resource):
    def patch(self):
        body = request.get_json()

        blogID = body["blogID"]
        
        blog = Blog.objects.get(blogID=blogID)
       
        userID=body['userID']
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
        userID=request.form['userID']
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
    def patch(self,blogID,userID):
        # body = request.get_json()
        # userID=body["userID"]
        # blogID=body["blogID"]
        print(f"blogID : {blogID}")
        print(f"userID: {userID}")

        
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
        newUserWhoLiked  = userID
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
    def patch(self,blogID,userID):
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
            if(newUser == userID):
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
    def patch(self,blogID,userID):
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
        newUserWhoDisliked = userID
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
    def patch(self,blogID,userID):
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
            if(newUser == userID):
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
    def patch(self,blogID,userID):
        body=request.get_json()
        commentID=uuid.uuid4()
        # userID=body['userID']
        # blogID=body['blogID']
        commentDescription=body['commentDescription']

        blog=Blog.objects.get(blogID=blogID)

        # if(userID!= blog['userID']):
        #     return make_response(jsonify({"message":"you are not authorised to update this blog","statusCode":500}))

        if(len(commentDescription)>=300 or len(commentDescription)<6):
            return make_response(jsonify({"message":"comment must be more than 6 characters and less than 300 characters"}))
        
        comment=Comment(
            commentID=commentID,
            commentDescription=commentDescription
        )
        # comment.save()
        
        comments=blog['comments']
        
        newComments=comments.append(comment)

        blog.update(
            comments=newComments
        )
        blog.save()
        return make_response(jsonify({"message":"you have successfully added comment on the    blog","statusCode":"200","blog":blog,"success":True}))

class RemoveCommentonBlog(Resource):
    def patch(self,blogID,userID):
        body=request.get_json()
        commentID=body['commentID']
        # userID=body['userID']
        # blogID=body['blogID']
    
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

class GetBlogs(Resource):
    def get(self):
        blogs=Blog.objects().exclude("blogDescription","comments","likedByUsersList","dislikedByUsersList")
        # print(blogs)
        return make_response(jsonify({"blogs":blogs,"success":True}))

class GetBlogsByUser(Resource):
    def get(self,userID):
        # body=request.get_json()
        # userID=body['userID']
        blogsByUser=Blog.objects(userID=userID)
        return make_response(jsonify({"blogs":blogsByUser,"statusCode":200,"success":True}))

class GetBlogByBlogID(Resource):
    def get(self,blogID):
        # body=request.get_json()
        blog = Blog.objects.get(blogID=blogID)
        return make_response(jsonify({"blog":blog,"statusCode":200,"success":True}))

