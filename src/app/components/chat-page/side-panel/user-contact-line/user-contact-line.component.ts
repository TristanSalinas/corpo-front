import { Component, inject, input, OnInit, signal } from '@angular/core';
import { User } from '../../../../types/correspondents';
import { ChatService } from '../../../../services/chat.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-user-contact-line',
  imports: [],
  templateUrl: './user-contact-line.component.html',
  styleUrl: './user-contact-line.component.css',
})
export class UserContactLineComponent implements OnInit {
  chatService = inject(ChatService);
  apiService = inject(ApiService);
  router = inject(Router);
  user = input.required<User>();
  unreadNbr = signal(0);
  conversation_id: number | null = null;

  //on init ask back if current user has unread messages relative to this user then store the nbr in unreadNbr and conversation id in conversation_id
  //then subscribe to the found conversation
  //if no conversation is found listen to all message stream and check if the sender is the current this.user if so set conv_id
  ngOnInit(): void {
    this.apiService
      .conversationDataWithUser(this.user().id)
      .subscribe((conversation) => {
        this.unreadNbr.set(conversation.unread_messages);
        this.conversation_id = conversation.id;
      });
  }

  //on switchroom setcurrentConversation to conversation_id, it can be null.
  switchRoom() {
    this.chatService.setCurrentConversation(this.conversation_id);
    this.router.navigateByUrl(
      `/chat/${this.user().username}#${this.user().id}`
    );
  }
}
