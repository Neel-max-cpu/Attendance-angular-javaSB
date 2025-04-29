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
  imports: [LucideAngularModule, NgIf, NgFor, DatePicker, DatePipe],
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
    this.selectedDate = new Date();
    this.loadHistoryForDate(this.selectedDate);
    
    const activePunch = localStorage.getItem('punchInTime');
    if(activePunch){
      this.isPunchedIn = true;
      this.punchInTime = new Date(activePunch);
    }
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
      localStorage.setItem('punchInTime', this.punchInTime.toISOString());

      // push at the last - unshit at the front
      this.punches.unshift({
        punchIn: this.punchInTime.toISOString(),
        punchOut: ''
      });
    })
  }

  // stop the timer
  punchOut(){
    this.punchService.punchOut().subscribe((response)=>{
      this.isPunchedIn = false;
      this.punchOutTime = new Date();      
      localStorage.removeItem('punchInTime');

      const lastPunch = this.punches[0];
      if(lastPunch) lastPunch.punchOut = this.punchOutTime.toISOString();

      if(this.punchInTime && this.punchOutTime){
        const timeDiff = Math.abs(this.punchOutTime.getTime() - this.punchInTime.getTime());
        // console.log(timeDiff);
        const minutes = Math.floor(timeDiff / (1000 * 60));
        this.todayTotalTime += minutes;
      }
    });
  }

  loadHistoryForDate(date: Date) {
    const formattedDate = this.formatDate(date);
    this.punchService.historyViaDate(formattedDate).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.noData = false;
          this.todayTotalTime = data.reduce((acc: number, curr: any) => {
            const punchIn = new Date(curr.punchIn);
            // console.log("punchin: "+ punchIn.getTime());
            const punchOut = new Date(curr.punchOut);
            // console.log("punchout" + punchOut.getTime());
            const diff = (punchOut.getTime() - punchIn.getTime()) / (1000 * 60); 
            return acc + Math.max(0, Math.floor(diff));
          }, 0);
          this.punches = data.map((p: any) => ({
            punchIn: p.punchIn,
            punchOut: p.punchOut
          }));

          // console.log(this.punches);
          // console.log(this.todayTotalTime);
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
    return `${year}-${month}-${day}`; 
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
