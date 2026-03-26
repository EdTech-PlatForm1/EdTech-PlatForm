import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

type AuthTab = 'login' | 'register';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  activeTab: AuthTab = 'login';
  loading = false;
  message = '';
  error = '';

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  registerForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  });

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  setTab(tab: AuthTab) {
    this.activeTab = tab;
    this.error = '';
    this.message = '';
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.error = 'Please enter a valid email and password.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.message = '';

    const { email, password } = this.loginForm.value;
    this.authService.login({
      email: email!,
      password: password!
    }).subscribe({
      next: (res) => {
        this.message = res.message || 'Login successful!';
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message || 'Login failed. Please try again.';
        this.loading = false;
      }
    });
  }

  onRegister() {
    if (this.registerForm.invalid) {
      this.error = 'Please fill in all fields correctly.';
      return;
    }

    const { password, confirmPassword } = this.registerForm.value;
    if (password !== confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.message = '';

    const { username, email } = this.registerForm.value;
    this.authService.register({
      name: username!,
      email: email!,
      password: password!
    }).subscribe({
      next: (res) => {
        this.message = res.message || 'Account created successfully!';
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message || 'Account creation failed.';
        this.loading = false;
      }
    });
  }

}
