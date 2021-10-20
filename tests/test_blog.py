import pytest
import json
import sys
import os
from dotenv import load_dotenv
from werkzeug import test
currentdir =os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0,currentdir)
load_dotenv()
import config
from backend import app,db
from backend.database.models import User,Profile,Blog,Comment,MetaData
import uuid

def create_test_user():
    emailID='test_user@gmail.com'
    test_user=User()
    test_user.firstName='Test'
    test_user.lastName='User'
    test_user.userID=uuid.uuid4()
    test_user.emailID=emailID
    test_user.confirmPassword=test_user.generate_password()
    test_user.password=test_user.confirmPassword
    test_user.role=0
    test_user.isVerified=True
    test_user.hash_password()
    test_user.save()
    test_user_profile=Profile()
    test_user_profile.profileID=uuid.uuid4()
    test_user_profile.userID=test_user.userID
    test_user_profile.profileGender='MALE'
    test_user_profile.profileName='TestUser'
    test_user_profile.profileUserName='testuser123'
    test_user_profile.randomize()
    test_user_profile.save()
    return test_user,test_user_profile


def delete_test_user(test_user):
    test_user=User.objects.get(emailID=test_user.emailID)
    test_user_profile=Profile.objects(userID=test_user.userID).first()
    if test_user_profile is not None:
        test_user_blogs=Blog.objects(profileID=test_user_profile.profileID)
        test_user_blogs.delete()
        test_user_profile.delete()
    test_user.delete()
    
    

@pytest.fixture
def client():
    env_config = os.environ.get("APP_SETTINGS") or "DevelopmentConfig"
    app.config.from_object("config."+env_config)
    yield app.test_client()

def manage_test_user():
    try:
        u=User.objects.get(emailID='test_user@gmail.com')
        delete_test_user(u)
    finally:
        return create_test_user()


def test_AddBlogDescriptionAndTitle(client):
    """
    Routes.py - 20
    """
    user, profile = manage_test_user()
    mimetype = 'application/json'
    headers = {
        'Content-Type': mimetype,
        'Accept': mimetype,
        'Authorization':user.encode_signin_token()
    }
    data1 = {
        "blogTitle":"Test",
        "blogDescription":"A test blog is a site where you do all your testing especially if you are unsure of the outcome. It could be installing a new premium template, adding a script or codes, trying out new hacks and tweaks and many more. It could really be risky to apply updates directly to your live blog especially if it's a major change. If you're installing a premium template on a Blogger blog that has existing content and is a live blog, I strongly recommend you first install the template on a test blog, set up and tweak your blog and then export your new setup to your live blog."
    }
    response = client.post('/blog/addBlogDescriptionAndTitle',data=json.dumps(data1),headers=headers)
    assert response.json['statusCode']==500
    assert response.json['message'] == 'blog title must be more than 6 characters long'
    data2 = {
        "blogTitle":"Testing",
        "blogDescription":"Hello"
    }
    response = client.post('/blog/addBlogDescriptionAndTitle',data=json.dumps(data2),headers=headers)
    assert response.json['statusCode'] == 500
    assert response.json['message'] == 'blog description must be more than 200 characters long'
    data3 = {
        "blogTitle":"Testing",
        "blogDescription":"Hello Test Random Test Hello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random Test"
    }
    response = client.post('/blog/addBlogDescriptionAndTitle',data=json.dumps(data3),headers=headers)
    assert response.json['blog']['blogImageURL'] is not None
    assert response.json['blog']['blogStatus'] == 'DRAFTED'
    assert response.json['blog']['blogTitle']=='Testing'
    Blog.objects(blogID=response.json['blog']['blogID']).delete()
    delete_test_user(user)

def test_UpdateBlogDescriptionAndText(client):
    user, profile = manage_test_user()
    mimetype = 'application/json'
    headers = {
        'Content-Type': mimetype,
        'Accept': mimetype,
        'Authorization':user.encode_signin_token()
    }
    data3 = {
        "blogTitle":"Testing",
        "blogDescription":"Hello Test Random Test Hello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random Test"
    }
    response = client.post('/blog/addBlogDescriptionAndTitle',data=json.dumps(data3),headers=headers)
    data={
        'blogID':response.json['blog']['blogID'],
        'blogTitle':'Testing Updated',
        'blogDescription':data3['blogDescription']
    }
    response=client.patch('/blog/updateBlogDescriptionAndTitle',data=json.dumps(data),headers=headers)
    assert response.json['blog']['blogTitle'] == 'Testing Updated'
    Blog.objects(blogID=response.json['blog']['blogID']).delete()
    delete_test_user(user)

#FORM-DATA TO BE DONE
def test_AddBlogImage(client):
    pass

def test_LikeOnBlog_RemoveLikeOnBlog(client):
    user, profile = manage_test_user()
    mimetype = 'application/json'
    headers = {
        'Content-Type': mimetype,
        'Accept': mimetype
    }
    blogID='a93a7d1b-c852-481a-817b-293c24d1f148'
    blog=Blog.objects.get(blogID=blogID)
    #Like On Blog
    response = client.patch('/blog/likeOnBlog/'+str(profile.profileID)+'/'+blogID,headers=headers)
    assert response.json['message']=='you have successfully liked the blog'
    assert str(profile.profileID) in response.json['blog']['likedByUsersList']
    assert response.json['blog']['likesCount']==blog.likesCount+1
    #Already Liked and Liked Again
    response = client.patch('/blog/likeOnBlog/'+str(profile.profileID)+'/'+blogID,headers=headers)
    assert response.json['message']=='Already Liked or disliked'
    #Remove Like on Blog
    response = client.patch('/blog/removeLikeOnBlog/'+str(profile.profileID)+'/'+blogID,headers=headers)
    assert response.json['message']=='you have successfully removed your  like on the blog'
    assert str(profile.profileID) not in response.json['blog']['likedByUsersList']
    assert response.json['blog']['likesCount']==blog.likesCount
    #Remove Like but there isnt any like
    response = client.patch('/blog/removeLikeOnBlog/'+str(profile.profileID)+'/'+blogID,headers=headers)
    assert response.json['message']=='User Hasnt Liked the blog to dislike'
    delete_test_user(user)

def test_DisLikeOnBlog_RemoveDisLikeOnBlog(client):
    user, profile = manage_test_user()
    mimetype = 'application/json'
    headers = {
        'Content-Type': mimetype,
        'Accept': mimetype
    }
    blogID='a93a7d1b-c852-481a-817b-293c24d1f148'
    blog=Blog.objects.get(blogID=blogID)
    #DisLike On Blog
    response = client.patch('/blog/dislikeOnBlog/'+str(profile.profileID)+'/'+blogID,headers=headers)
    assert response.json['message']=='you have successfully dis liked the blog'
    assert str(profile.profileID) in response.json['blog']['dislikedByUsersList']
    assert response.json['blog']['dislikesCount']==blog.dislikesCount+1
    #Already disLiked and disLiked Again
    response = client.patch('/blog/dislikeOnBlog/'+str(profile.profileID)+'/'+blogID,headers=headers)
    assert response.json['message']=='Already Disliked or liked'
    #Remove dislike
    response = client.patch('/blog/removeDislikeOnBlog/'+str(profile.profileID)+'/'+blogID,headers=headers)
    assert response.json['message']=='you have successfully removed your dis like on the blog'
    assert str(profile.profileID) not in response.json['blog']['dislikedByUsersList']
    assert response.json['blog']['dislikesCount']==blog.dislikesCount
    #Remove Like but there isnt any like
    response = client.patch('/blog/removeDislikeOnBlog/'+str(profile.profileID)+'/'+blogID,headers=headers)
    assert response.json['message']=='User hasnt disliked to remove dislike'
    delete_test_user(user)

def test_like_dislike(client):
    user, profile = manage_test_user()
    mimetype = 'application/json'
    headers = {
        'Content-Type': mimetype,
        'Accept': mimetype
    }
    blogID='a93a7d1b-c852-481a-817b-293c24d1f148'
    blog=Blog.objects.get(blogID=blogID)
    #Like On Blog
    response = client.patch('/blog/likeOnBlog/'+str(profile.profileID)+'/'+blogID,headers=headers)
    assert response.json['message']=='you have successfully liked the blog'
    assert str(profile.profileID) in response.json['blog']['likedByUsersList']
    assert response.json['blog']['likesCount']==blog.likesCount+1
    #Dislike On Blog
    response = client.patch('/blog/dislikeOnBlog/'+str(profile.profileID)+'/'+blogID,headers=headers)
    assert response.json['message']=='you have successfully dis liked the blog'
    assert str(profile.profileID) in response.json['blog']['dislikedByUsersList']
    assert response.json['blog']['dislikesCount']==blog.dislikesCount+1
    response = client.patch('/blog/removeDislikeOnBlog/'+str(profile.profileID)+'/'+blogID,headers=headers)
    assert response.json['message']=='you have successfully removed your dis like on the blog'
    assert str(profile.profileID) not in response.json['blog']['dislikedByUsersList']
    assert response.json['blog']['dislikesCount']==blog.dislikesCount
    delete_test_user(user)

def test_GetBlogsAndProfileDetails(client):
    """
    Route.py - 31

    """
    response=client.get('/blog/getBlogsAndProfileDetails')
    assert response.status_code==200

def test_GetBlogByBlogID(client):
    """
    Route.py - 32

    """
    response=client.get('/blog/getBlogByBlogID/73f979a3-35d1-41b4-a30f-fb36754c6037')
    assert response.json["statusCode"]==200

def test_GetBlogsByProfile(client):
    """
    Route.py - 34

    """
    response=client.get('/blog/getBlogsByProfile/mrcherry012')
    assert response.json["statusCode"]==200

def test_GetBlogStatus(client):
    """
    Route.py-64

    """
    response=client.get('/blog/getBlogStatus/e8c4835e-6c28-4969-abb1-5a25eebfac99/73f979a3-35d1-41b4-a30f-fb36754c6037')
    assert response.json["status"]=="Not Authorized"

    response=client.get('/blog/getBlogStatus/96f59486-18b4-4f03-8923-9e4571e8e6b5/73f979a3-35d1-41b4-a30f-fb36754c6037')
    assert response.json["status"]=="REVIEW"

def test_AddView(client):
    user, profile = manage_test_user()
    mimetype = 'application/json'
    headers = {
        'Content-Type': mimetype,
        'Accept': mimetype,
        'Authorization':user.encode_signin_token()
    }
    data3 = {
        "blogTitle":"Testing",
        "blogDescription":"Hello Test Random Test Hello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random Test"
    }
    response = client.post('/blog/addBlogDescriptionAndTitle',data=json.dumps(data3),headers=headers)
    blogID=response.json['blog']['blogID']
    response_patch = client.patch('/api/blog/addView/'+blogID)
    assert response_patch.json["status_code"]==200
    Blog.objects(blogID=response.json['blog']['blogID']).delete()
    delete_test_user(user)

def test_getCommentsByBlogID(client):
    blogID = "e6aacb55-b75f-4820-b851-e66827a6035a"
    response = client.get('/blog/getComments/'+blogID)
    assert response.json["status_code"]==200

def test_SearchBlog(client):
    mimetype = 'application/json'
    headers = {
        'Content-Type': mimetype,
        'Accept': mimetype
    }
    data1 = {
        "search":"asdf"
    }
    response = client.post('/blog/searchBlog',data=json.dumps(data1),headers=headers)
    assert response.json["Message"]=="Invalide Search String"

    data2 = {
        "search":"asdf asfas"
    }
    response = client.post('/blog/searchBlog',data=json.dumps(data2),headers=headers)
    assert response.status_code==200

def test_AddMetaData(client):
    user, profile = manage_test_user()
    mimetype = 'application/json'
    headers = {
        'Content-Type': mimetype,
        'Accept': mimetype,
        'Authorization':user.encode_signin_token()
    }
    data = {
        "blogTitle":"Testing",
        "blogDescription":"Hello Test Random Test Hello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random Test"
    }
    response = client.post('/blog/addBlogDescriptionAndTitle',data=json.dumps(data),headers=headers)
    data2 = {
        'blogID':response.json['blog']['blogID'],
        'type':response.json['blog']['blogStatus'],
        'metaTitle':"Test",
        'metaDescription':"Test",
        'metaKeywords':"Test"
    }
    response_post = client.post('/blog/addMeta',data=json.dumps(data2),headers=headers)
    assert response_post.json['Message']=='Invalid Length of Title'
    data3 = {
        'blogID':response.json['blog']['blogID'],
        'type':response.json['blog']['blogStatus'],
        'metaTitle':"Testing",
        'metaDescription':"Test",
        'metaKeywords':"Test"
    }
    response_post = client.post('/blog/addMeta',data=json.dumps(data3),headers=headers)
    assert response_post.json['Message']=='Invalid length for description'
    data4 = {
        'blogID':response.json['blog']['blogID'],
        'type':response.json['blog']['blogStatus'],
        'metaTitle':"Testing",
        'metaDescription':"TestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTest",
        'metaKeywords':"Test"
    }
    response_post = client.post('/blog/addMeta',data=json.dumps(data4),headers=headers)
    assert response_post.json['Message']=='Invalid length for description'
    data5 = {
        'blogID':response.json['blog']['blogID'],
        'type':response.json['blog']['blogStatus'],
        'metaTitle':"Testing",
        'metaDescription':"TestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTest",
        'metaKeywords':"TestTestTestTestTestTestTest"
    }
    response_post = client.post('/blog/addMeta',data=json.dumps(data5),headers=headers)
    assert response_post.json['Message']=='Successfull'
    Blog.objects(blogID=response.json['blog']['blogID']).delete()
    delete_test_user(user)

def test_UpdateBlogStatus(client):
    user, profile = manage_test_user()
    mimetype = 'application/json'
    headers = {
        'Content-Type': mimetype,
        'Accept': mimetype,
        'Authorization':user.encode_signin_token()
    }
    data = {
        "blogTitle":"Testing",
        "blogDescription":"Hello Test Random Test Hello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random Test"
    }
    response = client.post('/blog/addBlogDescriptionAndTitle',data=json.dumps(data),headers=headers)
    response_patch = client.patch('/blog/updateBlogStatus/'+str(profile.profileID)+'/'+response.json['blog']['blogID']+'/REVIEW')
    assert response_patch.json['status']=='Not Authorized'
    response_patch = client.patch('/blog/updateBlogStatus/96f59486-18b4-4f03-8923-9e4571e8e6b5/'+response.json['blog']['blogID']+'/REVIEW')
    assert response_patch.json['message']=='STATUS FORMAT NOT ACCEPTED'
    response_patch = client.patch('/blog/updateBlogStatus/96f59486-18b4-4f03-8923-9e4571e8e6b5/'+response.json['blog']['blogID']+'/DRAFTED')
    assert response_patch.json['message']=='Status updated successfully'
    Blog.objects(blogID=response.json['blog']['blogID']).delete()
    delete_test_user(user)

def test_GetBlogsAndProfileDetailsPagination(client):
    response = client.get('/blog/getBlogsPaginated/500')
    assert response.status_code==404

    response = client.get('/profile/getBlogsPaginated/0')
    assert response.json["success"]==True

def test_GetFeed(client):
    response = client.get('/api/blog/getFeed/96f59486-18b4-4f03-8923-9e4571e8e6b5/500')
    assert response.status_code==404

    response = client.get('/api/blog/getFeed/96f59486-18b4-4f03-8923-9e4571e8e6b5/0')
    assert response.json["success"]==True 

    response = client.get('/api/blog/getFeed/ef84fbcd-b413-4947-b2c5-30c03bf06e8e/500')
    assert response.status_code==404

    response = client.get('/api/blog/getFeed/ef84fbcd-b413-4947-b2c5-30c03bf06e8e/0')
    assert response.json["success"]==True

def test_AddComment_RemoveComment(client):
    user,profile = manage_test_user()
    mimetype = 'application/json'
    headers = {
        'Content-Type': mimetype,
        'Accept': mimetype,
        'Authorization':user.encode_signin_token()
    }
    data = {
        "blogTitle":"Testing",
        "blogDescription":"Hello Test Random Test Hello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random TestHello Test Random Test"
    }
    response = client.post('/blog/addBlogDescriptionAndTitle',data=json.dumps(data),headers=headers)
    data1 = {
        "blogID":response.json['blog']['blogID'],
        "profileID":str(profile.profileID),
        "commentDescription":"Test"
    } 
    response_patch = client.patch('/blog/addCommentToBlog',data=json.dumps(data1),headers=headers)
    assert response_patch.json['message']=='comment must be more than 6 characters and less than 300 characters'
    data2 = {
        "blogID":response.json['blog']['blogID'],
        "profileID":str(profile.profileID),
        "commentDescription":"Testing for comment lengthTesting for comment lengthTesting for comment lengthTesting for comment lengthTesting for comment lengthTesting for comment lengthTesting for comment lengthTesting for comment lengthTesting for comment lengthTesting for comment lengthTesting for comment lengthTesting for comment lengthTesting for comment length"
    } 
    response_patch = client.patch('/blog/addCommentToBlog',data=json.dumps(data2),headers=headers)
    assert response_patch.json['message']=='comment must be more than 6 characters and less than 300 characters'
    data3 = {
        "blogID":response.json['blog']['blogID'],
        "profileID":str(profile.profileID),
        "commentDescription":"Testing for comment lengthTesting for comment lengthTesting for comment lengthTesting for comment lengthTesting for comment length"
    }
    response_patch = client.patch('/blog/addCommentToBlog',data=json.dumps(data3),headers=headers)
    assert response_patch.json['message']=='you have successfully added comment on the    blog'
    
    data4 = {
        "commentID":response_patch.json['comment']['commentID'],
        "profileID":str(profile.profileID),
        "blogID":response.json['blog']['blogID']
    }
    response_patch = client.patch('/blog/removeCommentOnBlog',data=json.dumps(data4),headers=headers)
    assert response_patch.json['message']=='you have successfully removed comment on the blog'
    Blog.objects(blogID=response.json['blog']['blogID']).delete()
    delete_test_user(user)

def test_AddKeywords(client):
    response = client.get('/blog/getKeywords/abc')
    assert response.json['message']=='GADS TOKEN EXPIRED'
