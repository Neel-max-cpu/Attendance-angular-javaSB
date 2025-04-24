import { Component } from '@angular/core';


// icons -
import { LucideAngularModule, TicketCheck, TicketMinus,LogOut   } from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  imports: [LucideAngularModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  readonly TicketCheck = TicketCheck;
  readonly TicketMinus  = TicketMinus ;
  readonly LogOut   = LogOut  ;
}
