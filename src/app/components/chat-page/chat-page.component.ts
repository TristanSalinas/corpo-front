import { Component, inject, signal } from '@angular/core';
import { UserListComponent } from './side-panel/user-list/user-list.component';
import { RouterOutlet } from '@angular/router';

import { LogoutButtonComponent } from './side-panel/logout-button/logout-button.component';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-chat-page',
  imports: [UserListComponent, RouterOutlet, LogoutButtonComponent],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.css',
  standalone: true,
})
export class ChatPageComponent {
  readonly currentUser = signal(inject(AuthService).getCurrentUser());
}
