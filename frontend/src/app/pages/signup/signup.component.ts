import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

// component
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IftaLabelModule } from 'primeng/iftalabel';

// alert --
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  imports: [
    CardModule,
    ButtonModule,
    FormsModule,
    InputTextModule,
    IftaLabelModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  value: string | undefined;

  // it will be initiallized so !->put this
  signUpForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signUpForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      cpassword: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      this.authService.signUp(this.signUpForm.value).subscribe({
        next: (res) => {
          console.log('Signup Successful', res);
          // alert("Signup Successful!");
          // redirect to /login
          Swal.fire({
            title: 'Success',
            text: 'Account Created successfully!',
            icon: 'success',
          }).then(() => {
            this.router.navigate(['/login']);
          });
        },
        error: (err) => {
          console.log('Signup Failed', err);
          let errorMessage =
            'An error has occurred while trying to signup. Please try again.';
          if (err.error) {
            errorMessage = err.error;
          }
          Swal.fire({
            title: 'Error',
            text: errorMessage,
            icon: 'error',
          });
        },
      });
    }
  }
}
