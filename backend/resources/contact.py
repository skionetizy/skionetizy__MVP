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
        C.name=c['name']
        C.email=c['email']
        C.description=c['description']
        C.contactID=uuid.uuid4()
        template=env.get_template('contact_response.html')
        rendered_html=template.render(username=c['name'])
        send_email("Your Issue Has Been Brought To Our Notice",os.environ.get('MAIL_USERNAME'),recipients=[C.email],html=rendered_html)
        C.save()
        return {'id':str(C.contactID)}, 200