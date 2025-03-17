import { Injectable } from '@angular/core';
import { filter, map, Observable, share, Subject } from 'rxjs';

import {
  EnrichedConversation,
  Message,
  ServerSentEvents,
  UserSentEvents,
} from '../types/types';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private readonly url = 'ws://localhost:3000/chat/ws';
  private socket!: WebSocket;
  private messageSubject = new Subject<string>();

  connect(): void {
    this.socket = new WebSocket(this.url);

    this.socket.onmessage = (event) => {
      console.log('serverEvent: ', event.data);
      this.messageSubject.next(event.data);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.messageSubject.error(error);
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
      this.messageSubject.complete();
    };
  }

  sendEvent(userEvent: UserSentEvents): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(userEvent));
    } else {
      console.error('WebSocket is not open. Cannot send message.');
    }
  }

  getWSEventsStream(): Observable<ServerSentEvents> {
    return this.messageSubject
      .asObservable()
      .pipe(map((message) => JSON.parse(message) as ServerSentEvents));
  }

  getAllMessagesStream(): Observable<Message> {
    return this.getWSEventsStream().pipe(
      filter((event) => event.datatype === 'message'),
      map((event) => event.payload)
    );
  }

  getMessagesStreamFromConversation(id: number): Observable<Message> {
    return this.getAllMessagesStream().pipe(
      filter((message) => message.conversation_id === id)
    );
  }

  getConvCreationStream(): Observable<EnrichedConversation> {
    return this.getWSEventsStream().pipe(
      filter((event) => event.datatype === 'convCreation'),
      map((event) => event.payload)
    );
  }

  closeConnection(): void {
    this.socket.close();
  }
}
