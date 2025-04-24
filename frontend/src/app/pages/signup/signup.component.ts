import { Component } from '@angular/core';

// component 
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { IftaLabelModule } from 'primeng/iftalabel';

@Component({
  selector: 'app-signup',
  imports: [CardModule, ButtonModule,FormsModule, InputTextModule, IftaLabelModule],
  standalone:true,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  value: string | undefined;
}
