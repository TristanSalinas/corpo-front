import { Component, inject, OnInit, signal } from '@angular/core';

import { Router } from '@angular/router';

import { LogoutButtonComponent } from './side-panel/logout-button/logout-button.component';

import { AuthService } from '../../services/auth.service';
import { ChatService } from '../../services/chat.service';
import { EnrichedConversation, User } from '../../types/types';
import { ApiService } from '../../services/api.service';
import { ChatComponent } from './chat/chat.component';
import { SwipeDetectorDirective } from '../../directives/swipe-detector.directive';
import { RandomArtComponent } from '../commons/random-art/random-art.component';
import { ContactLineComponent } from './side-panel/contact-line/contact-line.component';

@Component({
  selector: 'app-chat-page',
  imports: [
    LogoutButtonComponent,
    ChatComponent,
    SwipeDetectorDirective,
    RandomArtComponent,
    ContactLineComponent,
  ],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.css',
  standalone: true,
})
export class ChatPageComponent {
  readonly apiService = inject(ApiService);
  readonly chatService = inject(ChatService);
  readonly authService = inject(AuthService);
  readonly router = inject(Router);

  readonly isSidePanelOpen = signal(true);

  navigateToChat(enrichedConversation: EnrichedConversation) {
    this.chatService.switchConversation(enrichedConversation);
    this.isSidePanelOpen.set(false);
  }

  createPrivateConversation(user: User) {
    this.apiService
      .createPrivateConversation(user.id)
      .then((newEnrichedConversation) => {
        console.log('newEnrichedConversation', newEnrichedConversation);
        this.navigateToChat(newEnrichedConversation);
      });
  }

  backToCurrentChat() {
    console.log('back to current chat');
    if (!this.chatService.currentConv()) return;
    this.isSidePanelOpen.set(false);
  }
}
