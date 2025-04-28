import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PunchService } from '../../services/punch.service';
import { NgIf, NgFor, DatePipe } from '@angular/common';




// icons -
import { LucideAngularModule, TicketCheck, TicketMinus,LogOut   } from 'lucide-angular';

// components -
import { DatePicker  } from 'primeng/datepicker';

@Component({
  selector: 'app-dashboard',
  imports: [LucideAngularModule, NgIf, NgFor, DatePipe, DatePicker],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  readonly TicketCheck = TicketCheck;
  readonly TicketMinus  = TicketMinus ;
  readonly LogOut = LogOut ;


  isPunchedIn = false;
  punchInTime : Date | null = null;
  punchOutTime : Date | null = null;
  todayTotalTime = 0;

  // todayPunchIn: Date | null = null;
  // toadyPunchOut: Date | null = null;
  
  punches: { punchIn: string, punchOut: string }[] = [];
  selectedDate: Date = new Date();
  noData : boolean = false;


  constructor(private router: Router, private punchService: PunchService){}

  ngOnInit() {
    // load punch history of a particular date
    this.loadHistoryForDate(this.selectedDate);
  }

  // formate time
  getFormattedTime(minutes: number): string{
    const hours = Math.floor(minutes/60);
    const mins = minutes%60;
    return `${hours}h ${mins}m`;
  }

  // start timer when punches in
  punchIn(){
    this.punchService.punchIn().subscribe((response)=>{
      this.isPunchedIn = true;
      this.punchInTime = new Date();      
    })
  }

  // stop the timer
  punchOut(){
    this.punchService.punchOut().subscribe((response)=>{
      this.isPunchedIn = false;
      this.punchOutTime = new Date();      

      if(this.punchInTime && this.punchOutTime){
        const timeDiff = Math.abs(this.punchOutTime.getTime() - this.punchInTime.getTime());
        this.todayTotalTime = Math.floor(timeDiff/(1000*60));   // time diff in minutes
      }
    });
  }

  loadHistoryForDate(date: Date) {
    const formattedDate = this.formatDate(date);
    this.punchService.historyViaDate(formattedDate).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.noData = false;
          this.todayTotalTime = data.reduce((acc: number, curr: any) => acc + curr.minutes, 0);
          this.punches = data.map((p: any) => ({
            punchIn: p.punchIn,
            punchOut: p.punchOut
          }));
        } else {
          this.noData = true;
          this.todayTotalTime = 0;
          this.punches = [];
        }
      },
      error: (err) => {
        console.error('Failed to load history', err);
        this.noData = true;
        this.todayTotalTime = 0;
        this.punches = [];
      }
    });
  }

  loadToday() {
    this.selectedDate = new Date();
    this.loadHistoryForDate(this.selectedDate);
  }

  onDateChange(event: any) {
    if (event) {
      this.selectedDate = event;
      this.loadHistoryForDate(this.selectedDate);
    }
  }

  // Format Date to yyyy-MM-dd (backend expects it)
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${day}-${month}`; // adjust based on your backend format
  }

  formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const mins = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${mins}`;
  }

  getFormattedTotalTime(): string {
    const hours = Math.floor(this.todayTotalTime / 60);
    const mins = this.todayTotalTime % 60;
    return `${hours}h ${mins}m`;
  }

  logout(){
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
