import { inject, Injectable, OnInit } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { AuthService } from './auth.service';
import { filter, Observable } from 'rxjs';
import { RecievedMessage } from '../types/message';
import { User } from '../types/correspondents';

@Injectable({
  providedIn: 'root',
})
export class ChatService implements OnInit {
  readonly websocketService = inject(WebsocketService);

  currentConversation: number | null = null;

  setCurrentConversation(conversation_id: number | null) {
    this.currentConversation = conversation_id;
  }

  sendMessage(messageContent: string) {
    if (this.currentConversation) {
      this.websocketService.sendMessage({
        conversation_id: this.currentConversation,
        content: messageContent,
        message_type: 'TEXT',
      });
    }
  }
  getMessageStreamForRoom(roomName: string): Observable<string> {
    return this.websocketService.getAllMessages().pipe(
      filter((message) => {
        const parsedMessage = JSON.parse(message) as RecievedMessage;
        return (
          `${parsedMessage.sender_name}#${parsedMessage.sender_id}` === roomName
        );
      })
    );
  }

  getMessageStreamFromCurrentConversation() {
    if (this.currentConversation) {
      return this.getMessageStreamFromConversation(this.currentConversation);
    }
    return undefined;
  }

  getMessageStreamFromConversation(id: number): Observable<string> {
    return this.websocketService.getAllMessages().pipe(
      filter((message) => {
        const parsedMessage = JSON.parse(message) as RecievedMessage;
        return parsedMessage.conversation_id === id;
      })
    );
  }
  getPrivateMessagesStream(): Observable<string> {
    return this.websocketService.getAllMessages().pipe(
      filter((message) => {
        const parsedMessage = JSON.parse(message) as RecievedMessage;
        return parsedMessage.isGroup === false;
      })
    );
  }

  getGroupMessagesStream(): Observable<string> {
    return this.websocketService.getAllMessages().pipe(
      filter((message) => {
        const parsedMessage = JSON.parse(message) as RecievedMessage;
        return parsedMessage.isGroup === true;
      })
    );
  }

  ngOnInit(): void {}
}
