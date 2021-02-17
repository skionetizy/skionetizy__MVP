from flask import make_response,request,jsonify
from flask_restful import Resource

from database.models import User

#sendgrid
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

class AuthorizeSignup(Resource):
    def post(self):

        body = request.get_json()

        newUser = User(
            firstName=body['firstName'],
            lastName=body['lastName'],
            emailID=body['emailID'],
            password=body['password'],
            confirmPassword=body['confirmPassword']
        )

        emailID=body['emailID']

        auth_token = newUser.encode_auth_token()

        redirect_url = f'http://127.0.0.1:5000/api/emailConfirmation/{auth_token}'

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

        return make_response(jsonify(newUser['emailID'],{"status":200}))
        # except Exception as e:
        #     print(e.message)

        