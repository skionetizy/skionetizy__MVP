from backend import db
from backend.database.models import Blog,Comment,Profile,User,MetaData


def reset_profile_counts():
    p=Profile.objects.all()
    for i in p:
        i.reset_keywords_count()
        i.save()
    