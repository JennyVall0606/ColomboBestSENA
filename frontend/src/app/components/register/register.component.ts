import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}
  

  register() {
    this.authService.register({ name: this.name, email: this.email, password: this.password }).subscribe(
      () => {
        this.router.navigate(['/login']); // Redirigir al login después del registro
      },
      (error) => {
        console.error('Error en registro:', error);
      }
    );
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }
}
