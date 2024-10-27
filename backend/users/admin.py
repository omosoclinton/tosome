from django.contrib import admin
from .models import TutorProfile, User, Profile, Session

# Register your models here.
admin.site.register(TutorProfile)
admin.site.register(User)
admin.site.register(Profile)
admin.site.register(Session)
