import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Message } from '../types/message';

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

  sendMessage(message: Message): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not open. Cannot send message.');
    }
  }

  getAllMessages(): Observable<string> {
    return this.messageSubject.asObservable();
  }

  closeConnection(): void {
    this.socket.close();
  }
}
