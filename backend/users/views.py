from django.shortcuts import render
from django.views.generic import ListView
from rest_framework import status, generics, response
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate, logout
from django.contrib.auth.models import User
from .serializers import TutorProfileSerializer, RegisterSerializer, SessionSerializer
from .serializers import UserSerializer, TutorUserProfileSerializer
from .models import TutorProfile
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from .models import Session
from django.utils import timezone


# Create your views here.  

class StudentRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.set_password(request.data['password'])
            user.save()
            
            return Response({"message": "User registered succesfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=400)
    
    def get(self, request):
        users = get_user_model().objects.all()
        serializer = RegisterSerializer(users, many=True)
        return Response(serializer.data, status=200)
    

    
class TutorRegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        user_serializer = RegisterSerializer(data=request.data)
        if user_serializer.is_valid():
            user = user_serializer.save(user_type='tutor')
            user.set_password(request.data['password'])
            user.save()
            tutor_profile_serializer = TutorProfileSerializer(data=request.data)
            if tutor_profile_serializer.is_valid():
                tutor_profile_serializer.save(user=user)
                return Response({"message": "Tutor registered successfully"}, status=status.HTTP_201_CREATED)
            else:
                user.delete()
                return Response({"errors": tutor_profile_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"errors": user_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
class CreateUserAndTutorView(generics.CreateAPIView):
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        user_serializer = RegisterSerializer(data=request.data)
        if user_serializer.is_valid():
            user = user_serializer.save()
            user.set_password(request.data['password'])
            user.save()
            tutor_profile_serializer = TutorProfileSerializer(data=request.data)

            if tutor_profile_serializer.is_valid():
                tutor_profile_serializer.save(user=user)
                return Response({"message": "Tutor registred succesfully"}, status=200)
            else:
                user.delete()
                return Response({"errors": tutor_profile_serializer.errors}, status=400)
        else:
            return Response({"errors": user_serializer.errors}, status=400)
  
        

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user = authenticate(username=request.data['username'], password=request.data['password'])
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        return Response({"message": "Invalid credentials"}, status=400)
    
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logged out succesfully"}, status=status.HTTP_205_RESET_CONTENT)
    
        except Exception as e:
            return Response({"error": str(e)}, status=400)



class UsersView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        users = get_user_model().objects.all()
        serializer = RegisterSerializer(users, many=True)
        return Response(serializer.data, status=200)
    

class UserView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        serializer = RegisterSerializer(user)
        return Response(serializer.data, status=200)
    
class TutorView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            tutor = TutorProfile.objects.get(user=request.user.id)
            serializer = TutorProfileSerializer(tutor)
            return Response(serializer.data, status=200)
        except TutorProfile.DoesNotExist:
            return Response({"detail": "No tutor profile for the user"}, status=404)
        except Exception as e:
            return Response({"detail": str(e)}, status=500)
    

class TutorProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        data['user'] = request.user.id
        serializer = TutorProfileSerializer(data=data)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)
    



class TutorSearchView(APIView):
    def get(self, request):
        subject = request.query_params.get('subject', None)
        if subject:
            tutors = TutorProfile.objects.filter(subjects__icontains=subject)
        else:
            tutors = TutorProfile.objects.all()
        
        serializer = TutorUserProfileSerializer(tutors, many=True)
        return Response(serializer.data)
    


class StudentView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        #print(user)
        if user.user_type !='student':
            return Response({'detail':'You are not supposed to be here'}, status=400)
        try:
            student = get_user_model().objects.get(pk=user.pk)
            serializer = UserSerializer(student)
            return Response(serializer.data, status=200)
        except Exception as e:
            return Response({'msg': str(e)}, status=500)
        

# class TutorView(APIView):
#     permission_classes = [IsAuthenticated]
#     def get(self, request):
#         user = request.user
#         #print(user)
#         if user.user_type !='student':
#             return Response({'detail':'You are not supposed to be here'}, status=400)
#         try:
#             student = get_user_model().objects.get(pk=user.pk)
#             serializer = UserSerializer(student)
#             return Response(serializer.data, status=200)
#         except Exception as e:
#             return Response({'msg': str(e)}, status=500)
        



class TutorListView(APIView):
    def get(self, request):
        subjects = request.query_params.get('subject')
        location = request.query_params.get('location')
        rating = request.query_params.get('rating')


        tutors = TutorProfile.objects.all()

        if subjects:
            tutors = tutors.filter(subjects=subjects)
        if location:
            tutors = tutors.filter(location=location)
        if rating:
            tutors = tutors.filter(rating__gte=rating)


        serializer = TutorUserProfileSerializer(tutors, many=True)
        return Response(serializer.data)



# sessions
class CreateSessionView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        tutor_id = request.data.get("tutor")
        student_id = request.user.id

        try:
            tutor_profile = TutorProfile.objects.get(id=tutor_id)
        except TutorProfile.DoesNotExist:
            return Response({"error": "Tutor profile non-existent"}, status=status.HTTP_404_NOT_FOUND)
        
        tutor = tutor_profile.user

        try:
            student = get_user_model().objects.get(id=student_id)
        except User.DoesNotExist:
            return Response({"error": "Tutor profile non-existent"}, status=status.HTTP_404_NOT_FOUND)
        print(student)
        print(tutor)
        serializer = SessionSerializer(data={
            "tutor": tutor,
            "student": student,
            "subject": request.data.get("subject"),
            "date": timezone.now(),
            "status": "Pending"  
        })
        print(serializer.initial_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ListSessionsView(generics.ListAPIView):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Session.objects.filter(student=self.request.user)  # retrieve sessions for the logged-in student


        

