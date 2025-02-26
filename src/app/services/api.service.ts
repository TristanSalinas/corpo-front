import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../types/correspondents';
import { Observable } from 'rxjs';
interface NbrOfUnreadMessagesFromUserObservableContent {
  number: number;
  conversation_id: number;
}
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000';

  private readonly http = inject(HttpClient);

  users() {
    return this.http.get<Array<User>>(`${this.apiUrl}/user/users`, {
      withCredentials: true,
    });
  }

  conversation(id: number) {}

  messagesFromConversation(id: number) {
    return;
  }

  nbrOfUnreadMessagesFromUser(id: number) {
    return this.http.get<Object<number: number, conversationId : number>>(
      `${this.apiUrl}/${id}/unread`,
      { withCredentials: true }
    );
  }
}
