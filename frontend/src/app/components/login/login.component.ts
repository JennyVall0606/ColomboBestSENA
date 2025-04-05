import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule] // 🔹 SIN `providers`
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login({ email: this.email, password: this.password }).subscribe(
      (response) => {
        this.authService.saveToken(response.token);
        this.router.navigate(['/']); // Redirigir después del login
      },
      (error) => {
        console.error('Error en login:', error);
      }
    );
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
