from backend.resources.authorize import ReverificationToken,AuthorizeEmailVerification, AuthorizeLogin, AuthorizeSignup, getUserDetails,GoogleAuth
from backend.resources.blog import AddMetaData,SearchBlog,AddKeywordsBlog,AddBlogDescriptionAndTitle,AddBlogImage, GetBlogsByProfile, UpdateBlogDescriptionAndText,RemoveLikeOnBlog,DislikeOnBlog,RemoveDislikeOnBlog,AddCommentToBlog, LikeOnBlog,RemoveCommentonBlog,GetBlogsAndProfileDetails,GetBlogByBlogID,GetFeed,AddView,GetCommentsByBlogID,GetBlogsAndProfileDetailsPagination,GetBlogStatus,UpdateBlogStatus
from backend.resources.profile import GetHoverDetails,AddProfileUsernameBioUserDetails, UpdateProfile, CheckProfileUsernameIsAvailableAPIHandler, GetProfileDetails, AddFollower,GetBlogsAndProfile,RemoveFollower,GetProfileandBlogsPaginated
from backend.resources.ai_models import GrammarCheck,KeywordsAI
from flask import send_from_directory
from backend import app,api


def initialize_routes(api):
    #_____authorisation-routes________
    api.add_resource(AuthorizeSignup,'/signup')
    api.add_resource(AuthorizeEmailVerification,'/api/emailVerification/<token>')
    api.add_resource(AuthorizeLogin,'/login')
    api.add_resource(ReverificationToken,'/auth/reverify')
    # api.add_resource(getUserFirstName,'/user/getUserFirstName/<userID>')
    api.add_resource(getUserDetails,'/user/getUserDetails/<userID>')
    #______blog-routes________
    #post
    api.add_resource(AddBlogDescriptionAndTitle,'/blog/addBlogDescriptionAndTitle')
    api.add_resource(AddBlogImage,'/blog/addBlogImage')
    #patch
    api.add_resource(UpdateBlogDescriptionAndText,'/blog/updateBlogDescriptionAndTitle')
    api.add_resource(LikeOnBlog,'/blog/likeOnBlog/<profileID>/<blogID>')
    api.add_resource(RemoveLikeOnBlog,'/blog/removeLikeOnBlog/<profileID>/<blogID>')
    api.add_resource(DislikeOnBlog,'/blog/dislikeOnBlog/<profileID>/<blogID>')
    api.add_resource(RemoveDislikeOnBlog,'/blog/removeDislikeOnBlog/<profileID>/<blogID>')
    api.add_resource(AddCommentToBlog,'/blog/addCommentToBlog')
    api.add_resource(RemoveCommentonBlog,'/blog/removeCommentOnBlog')
    #get
    api.add_resource(GetBlogsAndProfileDetails,'/blog/getBlogsAndProfileDetails')
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
    #Followes-Following
    api.add_resource(AddFollower,'/api/profile/addFollower/<profileID>')
    api.add_resource(RemoveFollower,'/profile/removeFollower/<profileID>')
    #Feeds API
    api.add_resource(GetFeed,'/api/blog/getFeed/<profileID>/<int:number>')
    #AddCount
    api.add_resource(AddView,'/api/blog/addView/<blogID>')
    #
    api.add_resource(GetCommentsByBlogID,'/blog/getComments/<blogID>')
    #
    api.add_resource(GetBlogsAndProfile,'/profile/getBlogsAndProfile/<int:number>/<profileUserName>/<type>')
    api.add_resource(AddKeywordsBlog,'/blog/getKeywords/<word>')

    api.add_resource(GoogleAuth,'/auth/authToken')
    api.add_resource(KeywordsAI,'/ai/keywords')

    api.add_resource(GetBlogsAndProfileDetailsPagination,'/blog/getBlogsPaginated/<int:number>')
    #Get blog Status
    api.add_resource(GetBlogStatus,'/blog/getBlogStatus/<profileID>/<blogID>')
    #Update Blog Status
    api.add_resource(UpdateBlogStatus,'/blog/updateBlogStatus/<profileID>/<blogID>/<blogStatus>')
    api.add_resource(SearchBlog,'/blog/searchBlog')
    api.add_resource(GetProfileandBlogsPaginated,'/profile/getBlogsPaginated/<int:number>')
    api.add_resource(GetHoverDetails,'/profile/getHover/<profileID>')
    api.add_resource(AddMetaData,'/blog/addMeta')
    
@app.route('/')
@app.route('/home',methods=['GET'])
def home():
    return send_from_directory(app.static_folder,'index.html')


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')
    

initialize_routes(api)

