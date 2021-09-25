from flask import json, make_response, jsonify, request, send_from_directory
from flask_restful import Resource
from flask_mail import Message
from  backend.database.models import Profile, User
from backend import mail,app
from threading import Thread
import requests
from functools import wraps
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
from jinja2 import Environment, FileSystemLoader

#Mail Jinja Renering
env=Environment(loader=FileSystemLoader('backend//resources//templates'))

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

def token_required(f):
    @wraps(f)
    def decorated(*args,**kwargs):
        token=None
        if 'Authorization' in request.headers:
            token=request.headers['Authorization']
        if not token:
            return make_response(jsonify({'Message':'Token is missing!!'}),401)
        
        try:
            data=jwt.decode(token,'SECRET_KEY',algorithms='HS256')
            current_user=User.objects.get(emailID=data['emailID'])
        except:
            return make_response(jsonify({'message':'Token is Invalid'}),401)
        return f(*args,**kwargs)
    return decorated

class AuthorizeSignup(Resource):
    def post(self):
        body = request.get_json()

        if len(body['firstName'])== 0  or len(body['emailID'])==0 :
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
        newUser = User(
            userID= uuid.uuid4(),
            firstName=body['firstName'],
            lastName=body['lastName'],
            emailID=body['emailID']
        )

        emailID=body['emailID']

        auth_token = newUser.encode_auth_token()
        print(f'{auth_token} here')
        redirect_url = f'https://skionetizymvp-staging.herokuapp.com/emailVerification/{auth_token}'
        template=env.get_template('emailVerification.html')
        rendered_html=template.render(username=body['firstName'],link=redirect_url)
        send_email("Skionetizy Email Verification for creating account",os.environ.get('MAIL_USERNAME'),recipients=[body["emailID"]],html=rendered_html)
        with open("output.html", "w") as fh:
            fh.write(rendered_html)
        x=newUser.generate_password()
        newUser.save()
        print(x)
        return make_response(jsonify({"emailID":newUser["emailID"],"statusCode":200,"password":x}))
    

class AuthorizeEmailVerification(Resource):
    def patch(self,token):
        print('Received token:',token)
        result=User.decode_auth_token(token)
        print(result)
        if result=='Singnature Expired.Please Signup Again' or result == 'Invalid Token':
            if result=='Signature Expired.Please Signup Again':
                return make_response(jsonify({"message":result,"status":500}))
            return make_response(jsonify({"message":result,"status":500}))
        user= User.objects.get(emailID=result)
        if user:
            user.update(isVerified=True)
            user.save()
            p=Profile()
            u=user
            p.profileID=uuid.uuid4()
            p.userID=u.userID
            p.randomize()
            p.profileName=u.firstName
            p.profileUserName=u.emailID.split('@')[0].replace('.','_')
            p.save()
            return make_response(jsonify({"user":user,"message":"User is now verified","status":200}))
        return make_response(jsonify({"message":"User verification failed","status":500}))

class ReverificationToken(Resource):
    def post(self):
        body=request.get_json()
        email=body['emailID']
        user=User.objects.get_or_404(emailID=email)
        if user.isVerified==1:
            return make_response(jsonify({'Message':'Already Verified','status':200}))
        else:
            auth_token=user.encode_auth_token()
            redirect_url = f'http://127.0.0.1:5000/emailVerification/{auth_token}'
            send_email("Skionetizy Email Verification for creating account",os.environ.get('MAIL_USERNAME'),recipients=[body["emailID"]],html=f"<a href={redirect_url}>and easy to do anywhere, even with Python</a>")
        return make_response(jsonify({'Message':'Reverification Mail Sent','success':True}))
        

class ForgotPassword(Resource):
    def post(self):
        '''
        1.Read email from json body
        2.Check if user is already registered
        3.If user not registered redirect return message
        4.else fetch person object from User
        5.encode jwt token
        6.send email
        '''
    def put(self):
        '''
        1.Reveice token
        2.deode token
        3.if successfull update password
        '''


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
        token=user.encode_signin_token()
        return make_response({"token":token,"message":"Logged in Successfully","status":200})

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
                                redirect_url='https://skionetizymvp-staging.herokuapp.com/auth/authToken',
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