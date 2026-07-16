import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/authservice.service';
import { LoginRequest } from '../../model/login-request';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
roles = [
    { key: 'admin',   label: 'Admin'   },
    { key: 'teacher', label: 'Teacher' },
    { key: 'student', label: 'Student' },
    { key: 'parent',  label: 'Parent'  },
    { key: 'driver',  label: 'Driver'  },
  ];
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  hidePassword = true;
  loading = false;
  errorMessage = '';

  loginForm = this.fb.group({

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8)
      ]
    ],

    rememberMe: [false]

  });

  login(): void {

    this.errorMessage = '';

    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;

    }

    this.loading = true;

    const payload: LoginRequest = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!
    };

    this.authService.login(payload).subscribe({

      next: (response) => {

        this.loading = false;

        console.log(response);

        this.router.navigate(['/dashboard']);

      },

      error: (error) => {

        this.loading = false;
        console.log(error);
        this.errorMessage =
          error.error?.message ?? 'Invalid email or password';

      }

    });

  }
selectedRole = 'admin';

selectRole(role: string): void {
  this.selectedRole = role;
}

togglePassword(): void {
  this.hidePassword = !this.hidePassword;
}

isFieldInvalid(field: string): boolean {

  const control = this.loginForm.get(field);

  return !!(
    control &&
    control.invalid &&
    (control.touched || control.dirty)
  );

}
}
