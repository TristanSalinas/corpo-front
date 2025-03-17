import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ChatService } from '../../../services/chat.service';
import { AuthService } from '../../../services/auth.service';
import { SwipeDetectorDirective } from '../../../directives/swipe-detector.directive';
import { MessageComponent } from './message/message.component';
import { RandomArtComponent } from '../../commons/random-art/random-art.component';

@Component({
  selector: 'app-chat',
  imports: [
    FormsModule,
    SwipeDetectorDirective,
    MessageComponent,
    RandomArtComponent,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  readonly chatService = inject(ChatService);
  readonly authService = inject(AuthService);
  isSidePanelOpen = input.required<WritableSignal<boolean>>();

  currentConvMembers = computed(
    () =>
      this.chatService
        .currentConv()
        ?.users.filter(
          (user) => user.id !== this.authService.currentUser()?.id
        ) ?? []
  );

  readonly messageToSend = signal({ message: '' });

  openSidePanel() {
    this.isSidePanelOpen().set(true);
  }
  onSubmit() {
    this.chatService.sendMessage(this.messageToSend().message);
    this.messageToSend.set({ message: '' });
  }
}
