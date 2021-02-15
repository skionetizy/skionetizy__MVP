from flask import make_response,request,jsonify
from flask_restful import Resource

from database.models import User

class AuthorizeSignup(Resource):
    def post(self):
        make_response(jsonify({"message":"testing"}))