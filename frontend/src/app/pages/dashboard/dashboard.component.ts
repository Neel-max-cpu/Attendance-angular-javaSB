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
  todaydate = true;
  punchInTime : Date | null = null;
  punchOutTime : Date | null = null;
  todayTotalTime = 0;

  // for live timer
  timerInterval: any;
  elapsedTime: string = '';
  
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
      this.startTimer();
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
      this.startTimer();

      // push at the last - unshit at the front
      this.punches.unshift({
        punchIn: this.punchInTime.toISOString(),
        punchOut: ''
      });
    })
  }

  // stop the timer
  punchOut(){
    this.punchService.punchOut().subscribe({
      next: (response)=>{      
        this.stopTimer();
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
      },
      error: (err)=>{
        if(err.error && err.error.message === "Punch out rejected: more than 12 hours have passed!"){
          alert("Punch-out rejected: more than 12 hours has passed!");
        }
        else{
          console.log("Failed to punch out!", err);
          alert("An error had occured while punching out!");
        }
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
    this.todaydate = true;
    this.loadHistoryForDate(this.selectedDate);
  }

  onDateChange(event: any) {
    if (event) {
      this.selectedDate = event;
      this.todaydate = this.isToday(event); 
      this.loadHistoryForDate(this.selectedDate);
    }
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
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

  startTimer(){
    this.updateElapsedTime();
    this.timerInterval = setInterval(()=>{
      this.updateElapsedTime();
    }, 1000);
  }

  stopTimer(){
    clearInterval(this.timerInterval);
    this.timerInterval = null;
    this.elapsedTime = '';
  }

  updateElapsedTime(){
    if(this.punchInTime){
      const now = new Date();
      const diffMs = now.getTime() - this.punchInTime.getTime();
      const hours = Math.floor(diffMs / 3600000);
      const minutes = Math.floor((diffMs % 3600000) / 60000);
      const seconds = Math.floor((diffMs % 60000) / 1000);
      this.elapsedTime = `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
    }
  }

  pad(n: number): string {
    return n < 10 ? '0' + n : n.toString();
  }

  logout(){
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
