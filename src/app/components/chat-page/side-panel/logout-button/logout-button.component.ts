import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { ChatService } from '../../../../services/chat.service';

@Component({
  selector: 'app-logout-button',
  imports: [],
  templateUrl: './logout-button.component.html',
  styleUrl: './logout-button.component.css',
})
export class LogoutButtonComponent {
  authService = inject(AuthService);
  chatService = inject(ChatService);
  router = inject(Router);

  logOut() {
    this.authService.logout().subscribe({
      next: (response) => {
        console.log('logout success : ', response);
        this.chatService.clear();
        this.router.navigateByUrl('/login');
      },
    });
  }
}
