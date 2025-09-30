from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .serializers import UserRegistrationSerializer


class RegisterView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': 'Successfully created new user.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']

        user = authenticate(request, username=email, password=password)

        if user:
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return Response(
                {'success': 'Successfully logged in.',
                'token': token.key,
                'email': token.user.email},
                status=status.HTTP_200_OK)
        return Response({'failed':'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({'success':'Successfully logged out.'})



class GetAllUsersView(ListAPIView):
    permission_classes = [IsAuthenticated]


    def get(self, request):
        users = User.objects.all()
        users_data = [{"id": u.id, "email": u.email, "first_name": u.first_name} for u in users]
        return Response(users_data)