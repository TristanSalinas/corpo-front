import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ChatPageComponent } from './components/chat-page/chat-page.component';
import { ChatComponent } from './components/chat-page/chat/chat.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'chat',
    component: ChatPageComponent,
    //children: [{ path: ':convName#convId', component: ChatComponent }],
  },
];
