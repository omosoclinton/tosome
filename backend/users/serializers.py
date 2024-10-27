from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework.authtoken.models import Token
from .models import TutorProfile, Profile, Session
from django.conf import settings
from django.contrib.auth import get_user_model

#Register Serializeer
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = get_user_model()
        fields = ('first_name','last_name','username', 'email', 'password', 'password2', 'user_type')
      
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match"})
        return attrs
    
    def create(self, validated_data):
        print('created')
        print(f'This is self validated data: {self.validated_data}')
        user = get_user_model()(
            last_name = self.validated_data['last_name'],
            first_name = self.validated_data['first_name'],
            username = self.validated_data['username'],
            email = self.validated_data['email'],
            user_type = self.validated_data['user_type'],
        )
        user.set_password(validated_data['password'])
        user.save()
        # Create a token for new user
        Token.objects.create(user=user)

        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('first_name','last_name','username', 'email','user_type',)

class TutorProfileSerializer(serializers.ModelSerializer):
       
    class Meta:
        model = TutorProfile
        fields = ['subjects', 'qualifications', 'experience']

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['image','about','phone_number','linked_in','github']

class TutorUserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
       
    class Meta:
        model = TutorProfile
        fields = ['id','subjects', 'qualifications', 'experience', 'user', 'rating', 'location', 'status']

class SessionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Session
        fields =  ['id','tutor', 'student', 'subject', 'date', 'status']





    
