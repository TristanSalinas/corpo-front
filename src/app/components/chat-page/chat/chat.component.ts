import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ChatService } from '../../../services/chat.service';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-chat',
  imports: [FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit {
  readonly roomName = signal<string | null>(null);
  private route = inject(ActivatedRoute);
  private chatService = inject(ChatService); // access to the websocket
  private apiService = inject(ApiService);

  readonly messages = signal<string[]>([]);
  readonly messageToSend = signal({
    message: '',
  });

  //on init ask back for archived messages for chatservice.currentconversation then subscribe to chatService.getMessageStreamFromCurrentConversation()
  //if no conversation id is in chatservice then switch chat sate to prepareConversation then listen to
  // allmessagestream and check if the message ("senderName" + "#" + "senderId" === roomName) If so add message to messages
  // and switch chat state to conversation

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      if (params) {
        this.roomName.set(params.get('chatId'));
      }
    });

    const messageStream$ =
      this.chatService.getMessageStreamFromCurrentConversation();

    if (messageStream$) {
      messageStream$.subscribe((message) => {
        this.messages.update((messages) => [...messages, message]);
      });
    }
  }

  //onSubmit if current room is in prepareConversation state make the back to create a conversation
  //and switch chat state to conversation then send the message through chatservice.sendMessage
  onSubmit(): void {
    this.chatService.sendMessage(this.messageToSend().message);
  }
}
