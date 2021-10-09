from flask import jsonify,make_response,request
from flask_restful import Resource
from backend.database.models import User,Blog,Profile
import uuid

# class AdminSignIn(Resource):
#     def post(self):
#         body=request.get_json()
        
