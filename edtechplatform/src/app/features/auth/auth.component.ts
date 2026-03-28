import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

type AuthTab = 'login' | 'register' | 'verify';

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

  otpForm = this.fb.group({
    otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
  });

  pendingEmail = '';

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

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
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/store';
        this.router.navigateByUrl(returnUrl);
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
      username: username!,
      email: email!,
      password: password!,
      confirmationpassword: confirmPassword!
    }).subscribe({
      next: (res) => {
        this.message = 'Verification code sent to your email. Please enter it below.';
        this.loading = false;
        this.pendingEmail = email!;
        this.setTab('verify');
      },
      error: (err) => {
        this.error = err?.message || 'Account creation failed.';
        this.loading = false;
      }
    });
  }

  onVerify() {
    if (this.otpForm.invalid) {
      this.error = 'Please enter the 6-digit code correctly.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.message = '';

    const { otp } = this.otpForm.value;
    this.authService.confirmEmail(this.pendingEmail, otp!).subscribe({
      next: (res) => {
        this.message = 'Email confirmed! You can now login.';
        this.loading = false;
        this.setTab('login');
      },
      error: (err) => {
        this.error = err?.message || 'Verification failed.';
        this.loading = false;
      }
    });
  }
}
