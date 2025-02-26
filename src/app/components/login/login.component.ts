import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);
  webSocketService = inject(WebsocketService);
  readonly credentials = signal({
    email: '',
    password: '',
  });

  readonly message = signal('');
  async onSubmit() {
    this.authService
      .login(this.credentials().email, this.credentials().password)
      .subscribe({
        next: (response: any) => {
          console.log('login success', response);
          this.authService.setCurrentUser(response.user);
          this.webSocketService.connect();
          this.router.navigateByUrl('/chat');
        },
        error: (error) => {
          console.log('Registration failed : ' + error.error.message);
          return error;
        },
      });
  }
}
