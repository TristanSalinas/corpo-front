import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule, RouterLink],
  standalone: true,
})
export class RegisterComponent {
  readonly user = signal({
    email: '',
    username: '',
    password: '',
  });

  readonly message = signal('');

  router = inject(Router);
  authService = inject(AuthService);

  onSubmit() {
    this.authService
      .register(this.user().email, this.user().username, this.user().password)
      .subscribe({
        next: (response: any) => {
          this.message.set(response.message);
          this.router.navigate(['/chat']);
        },
        error: (error) => {
          this.message.set('Registration failed : ' + error.error.message);

          this.router.navigate(['/register']);
        },
      });
  }
}
