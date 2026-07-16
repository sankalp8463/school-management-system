import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/authservice.service';
import { RegisterRequest } from '../../model/register-request';
import { AuthResponse } from '../../model/auth-response';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
roles = [
    { key: 'admin',   label: 'Admin'   },
    { key: 'teacher', label: 'Teacher' },
    { key: 'student', label: 'Student' },
    { key: 'parent',  label: 'Parent'  },
    { key: 'driver',  label: 'Driver'  },
  ];
  registerForm!: FormGroup;

  loading = false;

  errorMessage = '';

  successMessage = '';

  hidePassword = true;

  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    this.registerForm = this.fb.group({

      firstName: [
        '',
        [Validators.required]
      ],

      middleName: [''],

      lastName: [
        '',
        [Validators.required]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\+?[0-9]{10,15}$/)
        ]
      ],

      admissionNumber: [
        '',
        [Validators.required]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8)
        ]
      ],

      confirmPassword: [
        '',
        [Validators.required]
      ],

      role: ['STUDENT']

    }, {
      validators: this.passwordMatchValidator()
    });

  }

  // ===========================
  // PASSWORD MATCH VALIDATOR
  // ===========================
  selectedRole = 'admin';

selectRole(role: string): void {
  this.selectedRole = role;
}
  passwordMatchValidator(): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {

      const password = control.get('password')?.value;

      const confirmPassword = control.get('confirmPassword')?.value;

      if (!password || !confirmPassword) {
        return null;
      }

      return password === confirmPassword
        ? null
        : { passwordMismatch: true };

    };

  }

  // ===========================
  // SHOW PASSWORD
  // ===========================

  togglePassword(): void {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPassword(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  // ===========================
  // VALIDATION
  // ===========================

  isFieldInvalid(field: string): boolean {

    const control = this.registerForm.get(field);

    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched)
    );

  }

  get f() {
    return this.registerForm.controls;
  }

  // ===========================
  // REGISTER
  // ===========================

register(): void {

  this.errorMessage = '';
  this.successMessage = '';

  if (this.registerForm.invalid) {
    this.registerForm.markAllAsTouched();
    return;
  }

  this.loading = true;

  const payload: RegisterRequest = {
    firstName: this.registerForm.value.firstName,
    middleName: this.registerForm.value.middleName,
    lastName: this.registerForm.value.lastName,
    email: this.registerForm.value.email,
    phone: this.registerForm.value.phone,
    password: this.registerForm.value.password,
    confirmPassword: this.registerForm.value.confirmPassword,
    admissionNumber: this.registerForm.value.admissionNumber,
    role: this.selectedRole.toUpperCase()
  };

  console.log(payload);

  this.authService.register(payload).subscribe({
    next: (response: AuthResponse) => {

      this.loading = false;
      this.successMessage = response.message;

      this.registerForm.reset({
        role: 'STUDENT'
      });

      this.selectedRole = 'student';

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500);
    },

    error: (err) => {

      this.loading = false;

      console.error(err);

      this.errorMessage =
        err.error?.message ||
        err.error?.errors?.[0]?.message ||
        'Registration failed';
    }
  });

}
}
