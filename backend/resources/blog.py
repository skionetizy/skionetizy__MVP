from flask import make_response,jsonify
from flask.globals import request
from flask_restful import Resource
from bson.objectid import ObjectId

from cloudinary.uploader import upload
from cloudinary.utils import cloudinary_url

from database.models import Blog

from datetime import datetime
import uuid

class AddBlogDescriptionAndTitle(Resource):
    def post(self):
        body = request.get_json()
        # print(body)

        if len(body["blogTitle"])<=6:
            return make_response(jsonify({"message":"blog title must be more than 6 characters long","statusCode":500}))
        elif len(body["blogDescription"])<=200:
            return make_response(jsonify({"message":"blog description must be more than 200 characters long","statusCode":500}))

        


        newBlog= Blog(
            blogID = uuid.uuid4(),
            blogTitle=body["blogTitle"],
            blogDescription=body["blogDescription"],
            userID=body["userID"]
        )

        newBlog.save()

        return make_response(jsonify({"blog":newBlog,"statusCode":201}))

class updateBlogDescriptionAndText(Resource):
    def patch(self):
        body = request.get_json()
        blogID = body["blogID"]
        print(blogID)
        print(type(blogID))
        blog = Blog.objects.get(blogID=blogID)
        print(blog)
        blog.update(
            blogTitle=body["blogTitle"],
            blogDescription=body["blogDescription"]
        )
        blog.save()

        return make_response(jsonify({"blog":blog,"statusCode":200}))
    
class AddBlogImage(Resource):
    def patch(self):
        print("entered")
        # body = request["bodyID"]
        # body = print(request.form)
        # blogID = request.form["blogID"]
        # # print(body["blogID"])
        # blog = Blog.objects.get(_id=blogID)
        # print(request.form['blogID'])
        # print(request.files)
        # print(blog)
        blogID = request.form['blogID']
        # print(blogID)
        # newBlogId = f"ObjectID('${blogID}')"
        # blogID = str(blogID)
        blog = Blog.objects.get(blogID= blogID)
        # blog = Blog.objects.find_one({"_id":ObjectId(blogID)})
        # blog  = Blog.find_one({"_id":blogID})
        photo = request.files["file"]

        print(blog)

        upload_result = upload(photo)
        photo_url,options=cloudinary_url(
            upload_result['public_id']
        )

        current_datetime = datetime.now()
        print(type(photo_url))
        print(photo_url)
        print(current_datetime)
        


        blog.update(
            imageURL=photo_url,
            timestamp= current_datetime
        )
        # return make_response(jsonify(upload_result,photo_url,options))
        return make_response(jsonify({"blog":blog,"statusCode":201}))

        
