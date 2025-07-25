import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `<router-outlet />`,
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  readonly authService = inject(AuthService);
  readonly chatService = inject(ChatService);
  readonly router = inject(Router);
  
  ngOnInit() {
    this.authService.fetchCurrentUser();
    this.chatService.init();
  }
}
