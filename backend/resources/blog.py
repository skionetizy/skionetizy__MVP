from flask import make_response,jsonify
from flask.globals import request
from flask_restful import Resource

from database.models import Blog

class AddBlogDescriptionAndText(Resource):
    def post(self):
        body = request.get_json()
        # print(body)

        if len(body["blogTitle"])<=6:
            return make_response(jsonify({"message":"blog title must be more than 6 characters long","statusCode":500}))
        elif len(body["blogDescription"])<=200:
            return make_response(jsonify({"message":"blog description must be more than 200 characters long","statusCode":500}))

        newBlog= Blog(
            blogTitle=body["blogTitle"],
            blogDescription=body["blogDescription"],
            userID=body["userID"]
        )

        newBlog.save()

        return make_response(jsonify({"blog":newBlog,"statusCode":200}))
    
class AddBlogImage(Resource):
    def patch(self):
        body = request.get_json()
        blog = Blog.objects.get(_id=body["blogID"])

        
