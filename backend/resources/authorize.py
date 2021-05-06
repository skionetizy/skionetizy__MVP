from flask import json, make_response,jsonify,request
from flask_restful import Resource

from database.models import User

#sendgrid
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

#jwt
import jwt

class AuthorizeSignup(Resource):
    def post(self):

        body = request.get_json()

        if len(body['firstName'])== 0  or len(body['lastName']) == 0 or len(body['emailID'])==0 or len(body['password'] )== 0 or len(body['confirmPassword']) == 0 :
            return make_response(jsonify({"message":"all fields are required","statusCode":500}))
            # raise FieldsEmpty

        existingUser = User.objects(emailID = body['emailID'])
        if(existingUser):
            return make_response(jsonify({"message":"user already exists, try to login","statusCode":500}))
            # raise UserAlreadyExist

        if len(body['password']) <6:
            return make_response(jsonify({"message":"password is less than 6 characters","statusCode":500}))
            # raise PasswordIsShort

        if body['password'] != body['confirmPassword']:
            return make_response(jsonify({"message":"passwords doesnt match,please check","statusCode":500}))

        newUser = User(
            firstName=body['firstName'],
            lastName=body['lastName'],
            emailID=body['emailID'],
            password=body['password'],
            confirmPassword=body['confirmPassword']
        )

        emailID=body['emailID']

        auth_token = newUser.encode_auth_token()

        redirect_url = f'http://127.0.0.1:5000/emailConfirmation/{auth_token}'

        message = Mail(
            from_email='skionetizyofficial@gmail.com',
            to_emails=emailID,
            subject='Skionetizy Email Verification for creating account',
            html_content=f"<a href={redirect_url}>and easy to do anywhere, even with Python</a>")
        # try:
        sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        response = sg.send(message)
        # print(response.status_code)
        # print(response.body)
        # print(response.headers)

        newUser.hash_password()
        newUser.save()

        return make_response(jsonify({"userID": newUser['_id'],"statusCode":200}))
        # except Exception as e:
        #     print(e.message)

class AuthorizeEmailVerification(Resource):
    def patch(self,token):
        payload = jwt.decode(token,'SECRET_KEY',algorithms='HS256')
        emailID =  payload['emailID']

        user= User.objects.get(emailID=emailID)

        if user:
            user.update(isVerified=True)
            user.save()
            return make_response(jsonify({"user":user,"message":"User is now verified","status":200}))

        return make_response(jsonify({"message":"User verification failed","status":500}))


class AuthorizeLogin(Resource):
    def post(self):
        body = request.get_json()
        
        user = User.objects.get(emailID = body["emailID"])

        if not user:
            return make_response({"message":"create an account, before you login","status":500})
        # elif user["isVerified"]==False:
        elif user["isVerified"]==False:
            return make_response({"message":"Check your mail to verfiy, your email ID","status":500})
        
        isAuthorized = user.check_password(body.get('password'))
        if not isAuthorized:
            return make_response(jsonify({"message":"password is incorrect,please try again","statusCode":500}))
        
        return make_response({"user":user,"message":"Logged in Successfully","status":200})


        
