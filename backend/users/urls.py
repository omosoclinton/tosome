from django.urls import path
from .views import LoginView, LogoutView, UsersView, UserView, TutorProfileView, TutorView, TutorListView
from .views import TutorSearchView,StudentRegisterView,TutorRegisterView, CreateUserAndTutorView, StudentView
from .views import ListSessionsView, CreateSessionView
urlpatterns = [
    path('login/', LoginView.as_view(), name="login"),
    path('logout/', LogoutView.as_view(), name="logout"),
    path('get-users/', UsersView.as_view(), name="get-users" ),
    path('get-user/', UserView.as_view(), name="get-user" ),
    path('tutor-profile/', TutorProfileView.as_view(), name='tutor-profile'),
    path('get-tutor-profile/', TutorView.as_view(), name='get-tutor-profile'),
    path('search/', TutorSearchView.as_view(), name='search'),
    path('student-register/', StudentRegisterView.as_view()),
    path('tutor-register/', TutorRegisterView.as_view()),
    path('register-tutor/', CreateUserAndTutorView.as_view()),
    path('student-profile/', StudentView.as_view()),
    path('tutors/', TutorListView.as_view()),
    path('sessions/', ListSessionsView.as_view()),
    path('sessions/book/', CreateSessionView.as_view())
]