from flask import json, make_response,jsonify,request
import requests
from flask_restful import Resource
from flask_mail import Message
from  backend.database.models import Profile, User
from backend import mail,app
from threading import Thread
#sendgrid
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import json
from bson import json_util
#jwt
import jwt
from backend import authclient
import uuid
from urllib.parse import urlparse,parse_qs
#Async Mailing
def send_async_email(app, msg):
    with app.app_context():
        mail.send(msg)

#Mail Sending
def send_email(subject, sender, recipients, html):
    msg = Message(subject, sender=sender, recipients=recipients)
    msg.html = html
    thr = Thread(target=send_async_email, args=[app, msg])
    thr.start()

GOOGLE_DISCOVERY_URL="https://accounts.google.com/.well-known/openid-configuration"
def get_google_provider_cfg():
    return requests.get(GOOGLE_DISCOVERY_URL).json()



class AuthorizeSignup(Resource):
    def post(self):

        body = request.get_json()

        if len(body['firstName'])== 0  or len(body['lastName']) == 0 or len(body['emailID'])==0 or len(body['password'] )== 0 or len(body['confirmPassword']) == 0 :
            return make_response(jsonify({"message":"all fields are required","statusCode":500}))
            # raise FieldsEmpty
        print(body['firstName'])
        existingUser=None
        try:
            existingUser = User.objects.get(emailID = body['emailID'])
        except:
            pass
        if(existingUser):
            return make_response(jsonify({"message":"user already exists, try to login","statusCode":500}))
            # raise UserAlreadyExist

        if len(body['password']) <6:
            return make_response(jsonify({"message":"password is less than 6 characters","statusCode":500}))
            # raise PasswordIsShort

        if body['password'] != body['confirmPassword']:
            return make_response(jsonify({"message":"passwords doesnt match,please check","statusCode":500}))

        newUser = User(
            userID= uuid.uuid4(),
            firstName=body['firstName'],
            lastName=body['lastName'],
            emailID=body['emailID'],
            password=body['password'],
            confirmPassword=body['confirmPassword']
        )

        emailID=body['emailID']

        auth_token = newUser.encode_auth_token()

        redirect_url = f'http://127.0.0.1:5000/emailVerification/{auth_token}'

        send_email("Skionetizy Email Verification for creating account",os.environ.get('MAIL_USERNAME'),recipients=[body["emailID"]],html=f"<a href={redirect_url}>and easy to do anywhere, even with Python</a>")
        # message = Mail(
        #     from_email='skionetizyofficial@gmail.com',
        #     to_emails=emailID,
        #     subject='Skionetizy Email Verification for creating account',
        #     html_content=f"<a href={redirect_url}>and easy to do anywhere, even with Python</a>")
        # # try:
        # sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        # response = sg.send(message)
        # # print(response.status_code)
        # # print(response.body)
        # # print(response.headers)

        newUser.hash_password()
        newUser.save()

        return make_response(jsonify({"userID": newUser['_id'],"emailID":newUser["emailID"],"statusCode":200}))
        # except Exception as e:
        #     print(e.message)

class AuthorizeEmailVerification(Resource):
    def patch(self,token):
        payload = jwt.decode(token,'SECRET_KEY',algorithms='HS256')
        emailID =  payload['emailID']
        print("Is Running")
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
        profile=Profile.objects.get_or_404(userID=user.userID)
        if not user:
            return make_response({"message":"create an account, before you login","status":500})
        # elif user["isVerified"]==False:
        elif user["isVerified"]==False:
            return make_response({"message":"Check your mail to verfiy, your email ID","status":500})
        
        isAuthorized = user.check_password(body.get('password'))
        if not isAuthorized:
            return make_response(jsonify({"message":"password is incorrect,please try again","statusCode":500}))
        user=user.to_mongo().to_dict()
        user['profileID']=str(profile.profileID)
        return make_response({"user":json.loads(json_util.dumps(user)),"message":"Logged in Successfully","status":200})

# class getUserFirstName(Resource):
#     def get(self,userID):
#         # body=request.get_json()

#         print(f"userID:{userID}")
#         user = User.objects.get(userID=userID).only("firstName")

#         return make_response({"user":user,"message":"fetched user details  Successfully","status":200})

class getUserDetails(Resource):
    def get(self,userID):
        # body=request.get_json()

        print(f"userID:{userID}")
        user = User.objects.get(userID=userID)
        # user = User.objects(userID=userID)

        return make_response({"user":user,"message":"fetched user details  Successfully","status":200})


class GoogleAuth(Resource):
    def post(self,*args,**kwargs):
        body=request.get_json()
        callback_uri=body['callbackURL']
        parsed_url=urlparse(callback_uri)
        code=parse_qs(parsed_url.query)['code'][0]
        google_provider_cfg = get_google_provider_cfg()
        token_endpoint = google_provider_cfg["token_endpoint"]
        token_url, headers, body = authclient.prepare_token_request(
                                token_endpoint,
                                authorization_response=callback_uri,
                                redirect_url='http://skionetizymvp-staging.herokuapp.com/auth/authToken',
                                code=code
                            )
        token_response = requests.post(
            token_url,
            headers=headers,
            data=body,
            auth=( "1009912481477-rumk7lv3njmf7l3asoo7ee6808htfdtd.apps.googleusercontent.com", "xVWz8LZBMnaXvr1YNXGtjvhH"),
        )
        authclient.parse_request_body_response(json.dumps(token_response.json()))
        userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
        uri, headers, body = authclient.add_token(userinfo_endpoint)    
        userinfo_response = requests.get(uri, headers=headers, data=body)
        print(userinfo_response.content)
        if userinfo_response.json().get("email_verified"):
            users_email = userinfo_response.json()["email"]
            picture = userinfo_response.json()["picture"]
            users_name = userinfo_response.json()["name"]
        
            if User.objects(emailID=users_email).first():
                #Existing User
                return make_response(jsonify({'user':User.objects.get(emailID=users_email),'sucess':True}))
            else:
                #New User
                u=User()
                u.firstName=userinfo_response.json()["given_name"]
                u.lastName=userinfo_response.json()["family_name"]
                u.emailID=users_email
                u.password="LOGGEDINWITHGOOGLE"
                u.hash_password()
                u.confirmPassword="LOGGEDINWITHGOOGLE"
                u.userID=uuid.uuid4()
                u.isVerified=True
                u.save()
                p=Profile()
                p.profileID=uuid.uuid4()
                p.userID=u.userID
                p.profilePicImageURL=picture
                p.profileName=userinfo_response.json()["name"]
                p.profileUserName=u.emailID.split('@')[0].replace('.','_')
                p.save()
                return make_response(jsonify({'user':u,'profile':p,'success':1}))                
        else:
            return make_response(jsonify({"Message":"User email not available or not verified by Google."}))
            # first_name=users_name.split()[0]
            # second_name=''
            # if users_name.split()[1]:
            #     second_name=users_name.split()[1]
            # newUser = User(
            #     userID= uuid.uuid4(),
            #     firstName=first_name,
            #     lastName=second_name,
            #     emailID=body['emailID'],
            #     password=body['password'],
            #     confirmPassword=body['confirmPassword']
            # )
        
        return make_response(jsonify({'Message':'Backend Received The Data','sucess':True}))