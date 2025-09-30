import json

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from rest_framework.authtoken.models import Token

from chat.models import Chat, Message

from .serializers import MessageSerializer


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        room_id = self.scope['url_route']['kwargs']['room_id']

        self.room_id = f'room_{room_id}'
        await self.channel_layer.group_add(self.room_id, self.channel_name)
        await self.accept()

    async def receive(self, text_data=None):
        content = json.loads(text_data)

        serializer = MessageSerializer(data=content)
        if not serializer.is_valid():
            await self.send(text_data=json.dumps({'error': serializer.errors}))
            return

        token_key = content.get("token")
        user = await self.get_user(token_key)
        self.scope['user'] = user

        message = await self.create_message(content)

        await self.channel_layer.group_send(
            self.room_id,
            {
                "type": "send_message",
                "content": {
                    "sender": message.sender.id,
                    "content": message.content,
                    "room_id": message.chat.id,
                },
            },
        )

    async def send_message(self, event):
        await self.send(text_data=json.dumps({'message':event['content']}))


    @database_sync_to_async
    def get_user(self, token):
        token = Token.objects.get(key=token)
        return token.user

    @database_sync_to_async
    def create_message(self, data):
        chat = Chat.objects.get(id=data['room_id'])
        new_message = Message(
            chat=chat,
            sender=self.scope['user'],
            content=data['content']
        )
        new_message.save()
        return new_message

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_id, self.channel_name)