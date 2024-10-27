from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission, BaseUserManager
from django.contrib.auth import get_user_model
from django.dispatch import receiver
from django.db.models.signals import post_save
from enum import unique
from PIL import Image
from datetime import datetime

# Create your models here.
# class UserManager(BaseUserManager):
#     def create_user(self, email, password=None, **kwargs):

#         if not email:
#             raise ValueError("Email is required")

#         user = self.model(
#             email=self.normalize_email(email)
#         )

#         user.set_password(password)
#         user.save(using=self._db)

#         return user


class User(AbstractUser):
    email = models.EmailField(null=False, blank=False,)
    first_name = models.CharField(max_length=50, blank=False, null=False, default='Default first name')
    last_name = models.CharField(max_length=50, blank=False, null=False, default='Default last name')
    username = models.CharField(max_length=50, blank=False, null=False,unique=True)
    USER_TYPE_CHOICES = (
        ('student', 'Student'),
        ('tutor', 'Tutor')
    )
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='student')

    #objects = UserManager()
    #USERNAME_FIELD = 'username'
    #REQUIRED_FIELDS = ['first_name', 'last_name']

    groups = models.ManyToManyField(
        Group,
        related_name='custom_user_set',  # Change the related_name to something unique
        blank=True,
        help_text="The groups this user belongs to.",
        verbose_name="groups",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='custom_user_permissions_set',  # Change the related_name to something unique
        blank=True,
        help_text="Specific permissions for this user.",
        verbose_name="user permissions",
    )


    def __str__(self):
        return self.username



class TutorProfile(models.Model):
    user = models.OneToOneField(get_user_model(), on_delete=models.CASCADE)
    subjects = models.CharField(max_length=255)
    qualifications = models.TextField()
    experience = models.TextField()
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    location = models.CharField(max_length=255, default='Online')
    status = models.CharField(max_length=20, default='Under Review')

    def __str__(self):
        return f'{self.user.first_name} {self.user.last_name}'
    


class Profile(models.Model):
    user = models.OneToOneField(get_user_model(), on_delete=models.CASCADE)
    image = models.ImageField(upload_to='profile_pics/', default='profile_pics/default.jpg')
    about = models.TextField(blank=True, null=True)
    phone_number = models.CharField(max_length=10, default='0700***000')
    linked_in = models.CharField(max_length=255, default='linkedin.com')
    github = models.CharField(max_length=255, default='github.com')

    def __str__(self):
        return f'{self.user.first_name} Profile'
    
    def save(self, *args, **kwargs):
        super(Profile, self).save(*args, **kwargs)

        img = Image.open(self.image.path)

        if img.height > 300 and img.width > 300:
            output_size = (300, 300)
            img.thumbnail(output_size)
            img.save(self.image.path)

@receiver(post_save, sender=get_user_model())
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=get_user_model())
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()



class Session(models.Model):
    tutor = models.ForeignKey(get_user_model(), related_name='tutor_sessions', on_delete=models.CASCADE)
    student = models.ForeignKey(get_user_model(), related_name='student_sessions', on_delete=models.CASCADE)
    subject = models.CharField(max_length=255)
    date = models.DateTimeField(default=datetime.now)
    status = models.CharField(max_length=20, choices=[('Pending', 'Pending'), ('Confirmed', 'Confirmed'), ('Completed', 'Completed')], default='Pending')

    def __str__(self):
        return f"Session with {self.tutor.first_name} for {self.student.first_name}"


