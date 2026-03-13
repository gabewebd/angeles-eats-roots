import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { LucideAngularModule, User, Mail, Lock, LogIn, ArrowRight } from 'lucide-angular';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LucideAngularModule],
  templateUrl: './user-login.html',
  styleUrl: './user-login.css'
})
export class UserLogin {
  private authService = inject(AuthService);
  private router = inject(Router);

  credentials = { email: '', password: '' };
  isLoading = false;
  error = '';

  // Icons
  user = User;
  mail = Mail;
  lock = Lock;
  logIn = LogIn;
  arrowRight = ArrowRight;

  onSubmit() {
    this.isLoading = true;
    this.error = '';

    this.authService.userLogin(this.credentials).subscribe({
      next: (res) => {
        this.isLoading = false;
        // Redirect on success
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('User Login Error:', err);
        if (err.status === 401 || err.status === 400 || err.status === 404) {
          this.error = 'Invalid email or password. Please try again.';
        } else {
          this.error = 'An error occurred during login. Please try again later.';
        }
      }
    });
  }
}
