import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  chatService = inject(ChatService);
  authService = inject(AuthService);
  router = inject(Router);

  readonly credentials = signal({
    email: '',
    password: '',
  });

  readonly message = signal('');
  async onSubmit() {
    await this.authService.login(
      this.credentials().email,
      this.credentials().password
    );
    this.chatService.init();
    this.router.navigate(['/chat']);
  }
}
