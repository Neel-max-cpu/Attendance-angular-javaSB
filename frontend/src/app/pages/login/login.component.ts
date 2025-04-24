import { Component } from '@angular/core';

// component 
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { IftaLabelModule } from 'primeng/iftalabel';

// icons 
import { LucideAngularModule, Laugh  } from 'lucide-angular';

@Component({
  selector: 'app-login',
  imports: [CardModule, ButtonModule,FormsModule, InputTextModule, IftaLabelModule, LucideAngularModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  value: string | undefined;
  // icon
  readonly Laugh = Laugh;
}
