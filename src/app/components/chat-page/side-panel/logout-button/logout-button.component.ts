import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout-button',
  imports: [],
  templateUrl: './logout-button.component.html',
  styleUrl: './logout-button.component.css',
})
export class LogoutButtonComponent {
  authService = inject(AuthService);
  router = inject(Router);

  logOut() {
    this.authService.logout().subscribe({
      next: (response) => {
        console.log('logout success : ', response);
        this.router.navigateByUrl('/login');
      },
    });
  }
}
