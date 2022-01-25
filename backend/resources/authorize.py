from flask import json, make_response, jsonify, request, send_from_directory
from flask_restful import Resource
from flask_mail import Message
from backend.database.models import Profile, User
from backend import mail, app
from threading import Thread
import requests
from functools import wraps
# sendgrid
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import json
from bson import json_util
# jwt
import jwt
from backend import authclient
import uuid
from urllib.parse import urlparse, parse_qs
from jinja2 import Environment, FileSystemLoader

# Mail Jinja Renering
env = Environment(loader=FileSystemLoader('backend//resources//templates'))

# Async Mailing


def send_async_email(app, msg):
    with app.app_context():
        mail.send(msg)

# Mail Sending


def send_email(subject, sender, recipients, html):
    msg = Message(subject, sender=sender, recipients=recipients)
    msg.html = html
    thr = Thread(target=send_async_email, args=[app, msg])
    thr.start()


GOOGLE_DISCOVERY_URL = "https://accounts.google.com/.well-known/openid-configuration"


def get_google_provider_cfg():
    return requests.get(GOOGLE_DISCOVERY_URL).json()


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization']
        if not token:
            return make_response(jsonify({'Message': 'Token is missing!!'}), 401)

        try:
            data = jwt.decode(token, 'SECRET_KEY', algorithms='HS256')
            current_profile = Profile.objects.get(profileID=data['profileID'])
        except:
            return make_response(jsonify({'message': 'Token is Invalid'}), 401)
        return f(current_profile, *args, **kwargs)
    return decorated


class AuthorizeSignup(Resource):
    def post(self):
        body = request.get_json()
        print('Body ->', body)
        if len(body['firstName']) == 0 or len(body['emailID']) == 0:
            return make_response(jsonify({"message": "All fields are required", "statusCode": 500}))
            # raise FieldsEmpty
        print(body['firstName'])
        existingUser = None
        try:
            existingUser = User.objects.get(emailID=body['emailID'])
        except:
            pass
        if(existingUser):
            return make_response(jsonify({"message": "User already exists, try to login", "statusCode": 500}))
            # raise UserAlreadyExist
        newUser = User(
            userID=uuid.uuid4(),
            firstName=body['firstName'],
            lastName=body['lastName'],
            emailID=body['emailID']
        )

        emailID = body['emailID']

        auth_token = newUser.encode_auth_token()
        print(f'{auth_token} here')
        redirect_url = app.config.get(
            'FRONTEND_DOMAIN')+f'emailVerification/{auth_token}'
        template = env.get_template('emailVerification.html')
        x = newUser.generate_password()
        newUser.save()
        rendered_html = template.render(
            username=body['firstName'], link=redirect_url, password=x, domain=app.config.get('DOMAIN'))
        send_email("Skionetizy Email Verification for creating account", os.environ.get(
            'MAIL_USERNAME'), recipients=[body["emailID"]], html=rendered_html)
        return make_response(jsonify({"emailID": newUser["emailID"], "statusCode": 200, "password": x}))


class AuthorizeEmailVerification(Resource):
    def patch(self, token):
        print('Received token:', token)
        result = User.decode_auth_token(token)
        print(result)
        if result == 'Singnature Expired.Please Signup Again' or result == 'Invalid Token':
            if result == 'Signature Expired.Please Signup Again':
                return make_response(jsonify({"message": result, "status": 500}))
            return make_response(jsonify({"message": result, "status": 500}))
        user = User.objects.get(emailID=result)
        if user:
            p = Profile()
            p.randomize()
            print(p.profilePicImageURL)
            print(p.profileBannerImageURL)
            u = user
            p.profileID = uuid.uuid4()
            p.userID = u.userID
            p.profileName = u.firstName
            print(u.emailID)
            p.profileUserName = u.emailID.split('@')[0].replace('.', '_')
            p.save()
            user.update(isVerified=True)
            user.save()
            return make_response(jsonify({"user": user, "profile": p, "token": user.encode_signin_token(), "message": "User is now verified", "status": 200}))
        return make_response(jsonify({"message": "User verification failed", "status": 500}))


class ReverificationToken(Resource):
    def post(self):
        body = request.get_json()
        email = body['emailID']
        print("Email ->", email)
        user = User.objects.get_or_404(emailID=email)
        if user.isVerified == 1:
            print("Already Verified ->", email)
            return make_response(jsonify({'Message': 'Already Verified', 'status': 200}))
        else:
            print("Sending Email")
            auth_token = user.encode_auth_token()
            template = env.get_template('emailVerification.html')
            redirect_url = app.config.get(
                'FRONTEND_DOMAIN')+f'emailVerification/{auth_token}'
            rendered_html = template.render(
                username=user.firstName, link=redirect_url, domain=app.config.get('DOMAIN'))
            send_email("Skionetizy Email Verification for creating account", os.environ.get(
                'MAIL_USERNAME'), recipients=[body["emailID"]], html=rendered_html)
            return make_response(jsonify({'Message': 'Reverification Mail Sent', 'success': True}))
        
class ForgotPasswordResponseSend(Resource):
    def patch(self, token):
        body=request.get_json()
        '''
        1.Reveice token
        2.deode token
        3.if successfull update password
        '''
        print('Received token:',token)
        result=User.decode_auth_token(token)
        print(result)
        if result=='Singnature Expired.Please Signup Again' or result == 'Invalid Token':
            if result=='Signature Expired.Please Signup Again':
                return make_response(jsonify({"message":result,"status":500}))
            return make_response(jsonify({"message":result,"status":500}))
        user= User.objects.get(emailID=result)
        if user:
            if(body['password']==body['confirmpassword']):
                if(len(body['password'])<6):
                    return make_response(jsonify({"message": "Must be atleast 6 characters", "status":500}))
                user.password=body['password']
                user.update(confirmPassword=body['confirmpassword'])
                user.hash_password()
                user.save()
                return make_response(jsonify({"user":user,"token":user.encode_signin_token(),"message":"User's Password updated","status":200}))
        return make_response(jsonify({"message":"User's password updation failed","status":500}))
        
class ForgotPasswordRequestReceive(Resource):
    def post(self):
        '''
        1.Read email from json body
        2.Check if user is already registered
        3.If user not registered redirect return message
        4.else fetch person object from User
        5.encode jwt token
        6.send email
        '''
        body=request.get_json()
        try:
            User.objects.get(emailID = body["emailID"])
        except:
            return make_response({"message":"No acccount with emailID found!","status":500})
        # elif user["isVerified"]==False:
        user = User.objects.get(emailID = body["emailID"])
        if user["isVerified"]==False:
            return make_response({"message":"email ID not verified. Please reverify again.","status":500})
        print("Sending Email")
        auth_token=user.encode_auth_token()
        print(f'{auth_token} here')
        template=env.get_template('emailVerification.html')
        redirect_url = app.config.get('FRONTEND_DOMAIN')+f'forgotPassword/{auth_token}'
        rendered_html=template.render(username=user.firstName,link=redirect_url,domain=app.config.get('DOMAIN'))
        send_email("Skionetizy Password Update Mail",os.environ.get('MAIL_USERNAME'),recipients=[body["emailID"]],html=rendered_html)
        return make_response(jsonify({'Message':'Password update Mail Sent, please check','status':200, 'auth_token': auth_token}), 200)

class AuthorizeLogin(Resource):
    def post(self):
        body = request.get_json()
        try:
            User.objects.get(emailID=body["emailID"])
        except:
            return make_response({"message": "Create an account, before you login", "status": 500})
        # elif user["isVerified"]==False:
        user = User.objects.get(emailID=body["emailID"])
        if user["isVerified"] == False:
            return make_response({"message": "Check your mail to verfiy, your email ID", "status": 500})

        isAuthorized = user.check_password(body.get('password'))
        if not isAuthorized:
            return make_response(jsonify({"message": "Password is incorrect, please try again", "status": 500}))
        token = user.encode_signin_token()
        profile = Profile.objects.get(userID=user.userID)
        return make_response({"token": token, "profileID": profile.profileID,"user":user, "message": "Logged in Successfully", "status": 200})


class getUserDetails(Resource):
    def get(self, userID):
        # body=request.get_json()

        print(f"userID:{userID}")
        user = User.objects.get(userID=userID)
        # user = User.objects(userID=userID)

        return make_response({"user": user, "message": "fetched user details  Successfully", "status": 200})


class GoogleLoginHandle(Resource):
    def post(self):
        body = request.get_json()
        userinfo_response = body['profileObj']
        print(userinfo_response)
        # if userinfo_response.json().get("email_verified"):
        users_email = userinfo_response["email"]
        picture = userinfo_response["imageUrl"]
    
        if User.objects(emailID=users_email).first():
            #Existing User
            user=User.objects(emailID=users_email).first()
            profile=Profile.objects.get(userID=User.objects(emailID=users_email).first().userID)
            token=user.encode_signin_token()
            return make_response(jsonify({'token':token,'user':User.objects.get(emailID=users_email),'profile':profile,'sucess':True}))
        else:
            #New User
            u=User()
            u.firstName=userinfo_response["givenName"]
            try:
                u.lastName=userinfo_response["familyName"]
            except:
                u.lastName=''
            u.emailID=users_email
            u.password="LOGGEDINWITHGOOGLE"
            u.hash_password()
            u.confirmPassword="LOGGEDINWITHGOOGLE"
            u.userID=uuid.uuid4()
            u.isVerified=True
            u.save()
            p=Profile()
            p.randomize()
            p.profileID=uuid.uuid4()
            p.userID=u.userID
            p.profilePicImageURL=picture
            p.profileName=userinfo_response["name"]
            p.profileUserName=u.emailID.split('@')[0].replace('.','_')
            p.save()
            token=u.encode_signin_token()
            return make_response(jsonify({'token':token,'user':u,'profile':p,'success':1}))
        """ else:
            return make_response(jsonify({"Message":"User email not available or not verified by Google."})) """

class GoogleAuth(Resource):
    def post(self, *args, **kwargs):
        body = request.get_json()
        callback_uri = body['callbackURL']
        parsed_url = urlparse(callback_uri)
        code = parse_qs(parsed_url.query)['code'][0]
        google_provider_cfg = get_google_provider_cfg()
        token_endpoint = google_provider_cfg["token_endpoint"]
        if str(app.config.get('FRONTEND_DOMAIN')) == 'http://127.0.0.1:3000/':
            token_url, headers, body = authclient.prepare_token_request(
                token_endpoint,
                authorization_response=callback_uri,
                redirect_url='http://localhost:3000/auth/authToken',
                code=code
            )
        else:
            token_url, headers, body = authclient.prepare_token_request(
                token_endpoint,
                authorization_response=callback_uri,
                redirect_url=str(app.config.get(
                    'FRONTEND_DOMAIN'))+'auth/authToken',
                code=code
            )
        token_response = requests.post(
            token_url,
            headers=headers,
            data=body,
            auth=(app.config.get('GO_AUTH_CLIENT'),
                  app.config.get('GO_AUTH_SECRET')),
        )
        authclient.parse_request_body_response(
            json.dumps(token_response.json()))
        userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
        uri, headers, body = authclient.add_token(userinfo_endpoint)
        userinfo_response = requests.get(uri, headers=headers, data=body)
        print(userinfo_response.content)
        if userinfo_response.json().get("email_verified"):
            users_email = userinfo_response.json()["email"]
            picture = userinfo_response.json()["picture"]
            users_name = userinfo_response.json()["name"]

            if User.objects(emailID=users_email).first():
                # Existing User
                user = User.objects(emailID=users_email).first()
                profile = Profile.objects.get(
                    userID=User.objects(emailID=users_email).first().userID)
                token = user.encode_signin_token()
                return make_response(jsonify({'token': token, 'user': User.objects.get(emailID=users_email), 'profile': profile, 'sucess': True}))
            else:
                # New User
                u = User()
                u.firstName = userinfo_response.json()["given_name"]
                try:
                    u.lastName = userinfo_response.json()["family_name"]
                except:
                    u.lastName = ''
                u.emailID = users_email
                u.password = "LOGGEDINWITHGOOGLE"
                u.hash_password()
                u.confirmPassword = "LOGGEDINWITHGOOGLE"
                u.userID = uuid.uuid4()
                u.isVerified = True
                u.save()
                p = Profile()
                p.randomize()
                p.profileID = uuid.uuid4()
                p.userID = u.userID
                p.profilePicImageURL = picture
                p.profileName = userinfo_response.json()["name"]
                p.profileUserName = u.emailID.split('@')[0].replace('.', '_')
                p.save()
                token = u.encode_signin_token()
                return make_response(jsonify({'token': token, 'user': u, 'profile': p, 'success': 1}))
        else:
            return make_response(jsonify({"Message": "User email not available or not verified by Google."}))
