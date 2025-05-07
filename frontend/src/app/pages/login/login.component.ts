import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Route, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

// component 
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IftaLabelModule } from 'primeng/iftalabel';

// icons 
import { LucideAngularModule, Laugh  } from 'lucide-angular';

// alert --
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  imports: [CardModule, 
    ButtonModule,
    FormsModule, 
    InputTextModule, 
    IftaLabelModule, 
    LucideAngularModule, 
    IftaLabelModule, 
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  value: string | undefined;
  // icon
  readonly Laugh = Laugh;

  loginForm! :FormGroup;
  constructor(
    private fb: FormBuilder,
    private authService : AuthService,
    private router: Router,
  ){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    })
  }

  onSubmit(){
    if(this.loginForm.valid){
      this.authService.login(this.loginForm.value).subscribe({
        next: (res)=>{
          console.log("loggedin Successfully", res);
          // alert("loggedin successfull!");
          Swal.fire({
            title: "Success",
            text: "LoggedIn Successfully!",
            icon: "success"
          }).then(()=>{
            this.router.navigate(['/dashboard']);
          });
        },
        error: (err)=>{
          console.log("login Failed", err);
          let errorMessage = 'An error has occurred while trying to login. Please try again.';
          if (err.error) {
            errorMessage = err.error;
          }
          Swal.fire({
            title: "Error",
            text: errorMessage,
            icon: "error"
          })
        }
      })
    }
  }
}
