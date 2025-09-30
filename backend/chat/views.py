from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Chat, Message
from .serializers import ChatSerializer, MessageSerializer
from django.contrib.auth.models import User

class ListChats(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChatSerializer

    def get_queryset(self):
        return Chat.objects.filter(participants=self.request.user)

class CreateChat(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        users = [get_object_or_404(User, username=username) for username in request.data["participants"]]

        chat = Chat.objects.filter(participants__in=users)

        if chat.exists():
            chat = chat.first()
            serializer = ChatSerializer(chat)
            return Response(serializer.data, status=status.HTTP_200_OK)

        chat = Chat.objects.create()
        chat.participants.add(*users)
        chat.save()

        serializer = ChatSerializer(chat)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class MessagesHandler(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        chat_id = id
        chat = get_object_or_404(Chat, id=chat_id)

        if request.user not in chat.participants.all():
            return Response({'Auth Error':'User is not a participant of a chat.'}, status=status.HTTP_403_FORBIDDEN)

        messages = Message.objects.filter(chat=chat_id)

        serializer = MessageSerializer(messages, many=True)

        return Response(serializer.data)

    def post(self, request, id):
        chat_id = id
        chat = get_object_or_404(Chat, id=chat_id)

        if request.user not in chat.participants.all():
            return Response({'Auth Error':'User is not a participant of a chat.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = MessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(sender=request.user, chat=chat)
            return Response(serializer.data, status.HTTP_201_CREATED)
        return Response({'error': 'Something went wrong...'}, status=status.HTTP_400_BAD_REQUEST)
