from backend.resources.authorize import AuthorizeEmailVerification, AuthorizeLogin, AuthorizeSignup, getUserDetails#getUserFirstName
from backend.resources.blog import AddBlogDescriptionAndTitle,AddBlogImage, GetBlogsByProfile, UpdateBlogDescriptionAndText,RemoveLikeOnBlog,DislikeOnBlog,RemoveDislikeOnBlog,AddCommentToBlog, LikeOnBlog,RemoveCommentonBlog,GetBlogs,GetBlogByBlogID
from backend.resources.profile import AddProfileUsernameBioUserDetails, UpdateProfile, CheckProfileUsernameIsAvailableAPIHandler, GetProfileDetails
from backend.resources.ai_models import GrammarCheck
from flask import send_from_directory
from backend import app,api


def initialize_routes(api):
    #_____authorisation-routes________
    api.add_resource(AuthorizeSignup,'/signup')
    api.add_resource(AuthorizeEmailVerification,'/emailVerification/<token>')
    api.add_resource(AuthorizeLogin,'/login')
    # api.add_resource(getUserFirstName,'/user/getUserFirstName/<userID>')
    api.add_resource(getUserDetails,'/user/getUserDetails/<userID>')
    #______blog-routes________
    #post
    api.add_resource(AddBlogDescriptionAndTitle,'/blog/addBlogDescriptionAndTitle')
    api.add_resource(AddBlogImage,'/blog/addBlogImage')
    #patch
    api.add_resource(UpdateBlogDescriptionAndText,'/blog/updateBlogDescriptionAndTitle')
    api.add_resource(LikeOnBlog,'/blog/likeOnBlog/<userID>/<blogID>')
    api.add_resource(RemoveLikeOnBlog,'/blog/removeLikeOnBlog/<userID>/<blogID>')
    api.add_resource(DislikeOnBlog,'/blog/dislikeOnBlog/<userID>/<blogID>')
    api.add_resource(RemoveDislikeOnBlog,'/blog/removeDislikeOnBlog/<userID>/<blogID>')
    api.add_resource(AddCommentToBlog,'/blog/addCommentToBlog')
    api.add_resource(RemoveCommentonBlog,'/blog/removeCommentOnBlog')
    #get
    api.add_resource(GetBlogs,'/blog/getBlogs')
    api.add_resource(GetBlogByBlogID,'/blog/getBlogByBlogID/<blogID>')
    # api.add_resource(GetBlogsByProfile,'/blog/getBlogsByProfile/<profileID>')
    api.add_resource(GetBlogsByProfile,'/blog/getBlogsByProfile/<profileUserName>')
    #_______profile-routes_____
    #post
    api.add_resource(AddProfileUsernameBioUserDetails,'/profile/addProfileUsernameBioUserDetails/')
    api.add_resource(CheckProfileUsernameIsAvailableAPIHandler,'/profile/checkProfileUsernameIsAvailable')
    #patch
    api.add_resource(UpdateProfile,'/profile/updateBlogDescriptionAndText/<profileID>')
    #get
    # api.add_resource(GetProfileDetails,'/profile/getProfileDetails/<profileID>')
    api.add_resource(GetProfileDetails,'/profile/getProfileDetails/<profileUserName>')
    #ML
    api.add_resource(GrammarCheck,'/api/Grammar-Check')
    
initialize_routes(api)

@app.route('/')
@app.route('/home',methods=['GET'])
def home():
    return send_from_directory(app.static_folder,'index.html')


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')
    