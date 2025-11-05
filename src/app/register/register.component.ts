import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.authService.register(this.email, this.username, this.password).subscribe({
      next: (res) => {
        alert('Registration successful!');
        this.router.navigate(['/login']); // redirect to login page
      },
      error: (err) => {
        console.error(err);
        alert('Registration failed. Please try again.');
      }
    });
  }
}
