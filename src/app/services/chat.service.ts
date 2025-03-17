import { computed, inject, Injectable, signal } from '@angular/core';
import { WebsocketService } from './websocket.service';
import {
  EnrichedConversation,
  EnrichedMessage,
  Message,
  User,
} from '../types/types';
import { ApiService } from './api.service';
import { firstValueFrom, Observable, share, Subject, Subscription } from 'rxjs';
import { enrichMessages } from '../utils/utils';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  readonly websocketService = inject(WebsocketService);
  readonly apiService = inject(ApiService);
  readonly authService = inject(AuthService);

  currentConv = signal<EnrichedConversation | undefined>(undefined);
  currentConvMessages = signal<EnrichedMessage[]>([]);
  currentConvMessagesStream$: Observable<Message> | undefined = undefined;
  currentConvMessageSubscription: Subscription | undefined;

  users = signal<User[]>([]);
  privateConversations = signal<EnrichedConversation[]>([]);
  groupConversations = signal<EnrichedConversation[]>([]);
  uncontactedUsers = computed(() => {
    const returnValue = this.users()
      .filter((user) => {
        return !this.privateConversations().some((conv) =>
          conv.users.some((member) => member.id === user.id)
        );
      })
      .filter((user) => !(this.authService.currentUser()?.id === user.id));
    console.log('uncontactedUsers', returnValue);
    return returnValue;
  });

  sendMessage(messageContent: string) {
    const conversation = this.currentConv()?.conversation_id;

    if (conversation) {
      console.log('sending message to ', conversation);
      this.websocketService.sendEvent({
        datatype: 'message',
        payload: {
          conversationId: conversation,
          content: messageContent,
        },
      });
    }
  }

  async switchConversation(newCurrentConv: EnrichedConversation) {
    this.currentConv.set(newCurrentConv);
    //first fetch and messages from current conv
    this.currentConvMessages.set(
      enrichMessages(
        await this.apiService.getMessagesFromConversation(
          newCurrentConv.conversation_id
        ),
        newCurrentConv
      )
    );

    //then set  the stream message stream for this conv

    this.currentConvMessagesStream$ =
      this.websocketService.getMessagesStreamFromConversation(
        newCurrentConv.conversation_id
      );

    //unsubscribe from the previous stream if it exists
    this.currentConvMessageSubscription?.unsubscribe();

    //subscribe to the new stream and store the subscription for future unsubscribe.
    //the subscribe next should actualise the currentConvMessages[]
    this.currentConvMessageSubscription =
      this.currentConvMessagesStream$?.subscribe((message) => {
        this.currentConvMessages.update((prev) => [
          ...enrichMessages([message], newCurrentConv),
          ...prev,
        ]);
      });
  }

  clear() {
    this.currentConv.set(undefined);
    this.currentConvMessages.set([]);
    this.currentConvMessagesStream$ = undefined;

    this.users.set([]);
    this.privateConversations.set([]);
    this.groupConversations.set([]);
  }

  init() {
    //First get all conversations
    console.log('init chat service');
    this.clear();
    this.apiService.getEnrichedConversations().then((conversations) => {
      console.log('recieved enrichedconversations :', conversations);
      conversations.map((enrichedConversation) => {
        if (enrichedConversation.is_group) {
          this.groupConversations.update((prev) => [
            ...prev,
            enrichedConversation,
          ]);
        } else {
          this.privateConversations.update((prev) => [
            ...prev,
            enrichedConversation,
          ]);
        }
      });
    });

    //then get all users, exclude yourself and those with whom you already have a conversation
    this.apiService.getUsers().then((users) => {
      this.users.set(users);
    });
    // connect the ws
    this.websocketService.connect();

    //subscribe to new conversations event
    this.websocketService
      .getConvCreationStream()
      .subscribe((newEnrichedConversation) => {
        //on convCreation event, add the new conversation to the correct list

        if (newEnrichedConversation.is_group) {
          this.groupConversations.update((prev) => [
            ...prev,
            newEnrichedConversation,
          ]);
        } else {
          this.privateConversations.update((prev) => [
            ...prev,
            newEnrichedConversation,
          ]);
        }
      });
  }
}
