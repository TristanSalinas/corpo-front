import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../../services/auth.service';
import { UserContactLineComponent } from '../user-contact-line/user-contact-line.component';

@Component({
  selector: 'app-user-list',
  imports: [UserContactLineComponent],
  template: ` <div>
    <h2>User List</h2>
    <ul>
      @for (user of userList(); track user.id) { @if (user.id !==
      currentUserId()) {
      <app-user-contact-line [user]="user"></app-user-contact-line>
      } }
    </ul>
  </div>`,
  styleUrl: './user-list.component.css',
  standalone: true,
})
export class UserListComponent {
  readonly currentUserId = signal(inject(AuthService).getCurrentUserId());
  readonly userList = toSignal(inject(ApiService).users());

  //
}
