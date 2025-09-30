from django.db import models
from django.db.models import ManyToManyField, ForeignKey, CASCADE
from django.contrib.auth.models import User

# Create your models here.

class Chat(models.Model):
    participants = ManyToManyField(User)

class Message(models.Model):
    chat = ForeignKey(Chat, on_delete=CASCADE)
    sender = ForeignKey(User, on_delete=CASCADE)
    content = models.TextField()