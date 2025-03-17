import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnrichedConversation, Message, User } from '../types/types';
import { first, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000';

  private readonly http = inject(HttpClient);

  whoAmI() {}
  async getUsers() {
    console.log('getting Users...');
    return await firstValueFrom(
      this.http.get<Array<User>>(`${this.apiUrl}/user/users`, {
        withCredentials: true,
      })
    );
  }

  async getEnrichedConversations() {
    console.log('getting conversations...');
    return await firstValueFrom(
      this.http.get<Array<EnrichedConversation>>(
        `${this.apiUrl}/chat/conversations`,
        {
          withCredentials: true,
        }
      )
    );
  }

  async createPrivateConversation(targetUserId: number) {
    return (await firstValueFrom(
      this.http.post(
        `${this.apiUrl}/chat/new-private-conversation`,
        { targetUserId },
        { withCredentials: true }
      )
    )) as EnrichedConversation;
  }

  async getMessagesFromConversation(conversationId: number) {
    console.log('getting messages from conversation...', conversationId);
    return await firstValueFrom(
      this.http.get<Array<Message>>(
        `${this.apiUrl}/chat/messages/${conversationId}`,
        { withCredentials: true }
      )
    );
  }
}
