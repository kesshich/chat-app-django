from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'password', 'first_name')

    def create(self, validated_data):
        user = User(
            username = validated_data['email'],
            email = validated_data['email'],
            first_name = validated_data['first_name']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
            if user:
                raise serializers.ValidationError('User with this email already exists')
        except:
            return value

