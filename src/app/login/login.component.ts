import { Component, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loading      = signal(false);
  showPassword = signal(false);
  errorMessage = signal('');
  selectedRole = signal<string>('admin');

  roles = [
    { key: 'admin',   label: 'Admin'   },
    { key: 'teacher', label: 'Teacher' },
    { key: 'student', label: 'Student' },
    { key: 'parent',  label: 'Parent'  },
    { key: 'driver',  label: 'Driver'  },
  ];

  loginForm = this.fb.group({
    email:      ['', [Validators.required, Validators.email]],
    password:   ['', [Validators.required, Validators.minLength(8)]],
    rememberMe: [false],
  });

  constructor(private fb: FormBuilder, private router: Router) {}

  selectRole(key: string) { this.selectedRole.set(key); }
  togglePassword()        { this.showPassword.update(v => !v); }

  isFieldInvalid(field: string): boolean {
    const ctrl = this.loginForm.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  login() {
    if (this.loginForm.invalid) { this.loginForm.markAllAsTouched(); return; }
    this.loading.set(true);
    this.errorMessage.set('');
    // Simulate auth — replace with real AuthService call
    setTimeout(() => {
      this.loading.set(false);
      this.router.navigate(['/dashboard']);
    }, 1200);
  }
}
