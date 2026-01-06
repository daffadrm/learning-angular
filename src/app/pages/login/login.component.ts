import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    if (this.username === 'admin' && this.password === 'admin') {
      const data = {
        username: 'admin',
        realname: 'Admin Flexo',
        role: 'admin',
      };
      this.auth.login(data);
      this.router.navigate(['/']);
    } else if (this.username === 'staff' && this.password === 'staff') {
      const data = {
        username: 'staff',
        realname: 'Staff Flexo',
        role: 'staff',
      };
      this.auth.login(data);
      this.router.navigate(['/']);
    } else {
      alert('Username atau password salah!');
    }
  }
}
