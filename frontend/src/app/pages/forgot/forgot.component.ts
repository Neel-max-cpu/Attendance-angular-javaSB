import { Component } from '@angular/core';

// component 
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IftaLabelModule } from 'primeng/iftalabel';

// icons 
import { LucideAngularModule, Laugh  } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-forgot',
  imports: [
    CardModule,
    ButtonModule,
    FormsModule, 
    InputTextModule, 
    IftaLabelModule, 
    LucideAngularModule,
    IftaLabelModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './forgot.component.html',
  styleUrl: './forgot.component.css'
})
export class ForgotComponent {
  value: string | undefined;
  // icon
  readonly Laugh = Laugh;

  forgotForm! : FormGroup;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ){
    this.forgotForm = this.fb.group({
      email:['', [Validators.required, Validators.email]],
      oldPassword:['',[Validators.required]],
      newPassword:['',[Validators.required]],
      cPassword:['',[Validators.required]],
    })
  }

  onSubmit(){
    if(this.forgotForm.valid){
      this.authService.forgot(this.forgotForm.value).subscribe({
        next :(res)=>{
          console.log("Password Changed successfully", res);
          this.router.navigate(['/login']);
        },
        error: (err)=>{
          console.log("something went wrong!", err);
        }
      })
    }
  }
}
