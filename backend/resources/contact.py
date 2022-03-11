from os import stat
from flask import Flask,redirect,jsonify,make_response,request,render_template
from flask.helpers import send_from_directory
from flask.wrappers import Response
from flask_mail import Message
from flask_restful import Resource
from backend.database.models import contact
from backend import mail,app
from threading import Thread
import uuid
import os
from jinja2 import Environment, FileSystemLoader
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google.oauth2 import service_account
from datetime import date, datetime
import pytz

#API
SERVICE_ACCOUNT_FILE = 'backend/keys/serveraccountkey.json'
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

creds = None
creds = service_account.Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)

#The ID spreadsheet.
SPREADSHEET_ID = '1OpWN5-zAfb6CW1zK5DVGMFZJMmm6nHlDQ3oJDdQkar4'

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

class Contact(Resource):
    def get(self):
        c=contact.objects().to_json()
        return Response(c,mimetype="applcation/json",status=200)

    def post(self):
        c=request.get_json()
        C=contact()
        today = date.today()
        IST = pytz.timezone('Asia/Kolkata')
        time_ist = datetime.now(IST)

        C.name=c['name']
        C.email=c['email']
        C.description=c['description']
        C.contactID=uuid.uuid4()
        C.created_date=today.strftime("%d/%m/%Y")
        C.created_time=time_ist.strftime("%H:%M:%S %Z")
        C.ticket_status="OPEN"
        template=env.get_template('contact_response.html')
        rendered_html=template.render(username=c['name'])
        send_email("Your Issue Has Been Brought To Our Notice",os.environ.get('MAIL_USERNAME'),recipients=[C.email],html=rendered_html)
        C.save()        
        
        # Storing data
        input = [[str(C.contactID), C.name, C.email, C.description, C.created_date, C.created_time, C.ticket_status]]
        service = build('sheets', 'v4', credentials=creds)
        # Call the Sheets API to append data in sheet
        # As to append data from column A and row 2, A2 range is used
        req = service.spreadsheets().values().append(
            spreadsheetId=SPREADSHEET_ID, range="Sheet1!A2", valueInputOption="USER_ENTERED", body={"values": input})
        resp = req.execute()

        return {'id':str(C.contactID)}, 200