import { Component, computed, inject, input } from '@angular/core';
import { EnrichedMessage } from '../../../../types/types';
import { AuthService } from '../../../../services/auth.service';
import { DatePipe } from '@angular/common';
import { RandomArtComponent } from '../../../commons/random-art/random-art.component';

@Component({
  selector: 'app-message',
  imports: [DatePipe, RandomArtComponent],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css',
})
export class MessageComponent {
  readonly authService = inject(AuthService);
  enrichedMessage = input.required<EnrichedMessage>();
  isOwnMessage = computed(
    () =>
      this.enrichedMessage().sender.id === this.authService.currentUser()?.id
  );
}
