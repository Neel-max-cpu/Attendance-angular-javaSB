import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { NgIf, NgFor, DatePipe } from '@angular/common';

// icons -
import { LucideAngularModule, TicketCheck, TicketMinus,LogOut   } from 'lucide-angular';
import { PunchService } from '../../services/punch.service';
import { min } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [LucideAngularModule, NgIf, NgFor, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  readonly TicketCheck = TicketCheck;
  readonly TicketMinus  = TicketMinus ;
  readonly LogOut   = LogOut ;


  isPunchedIn = false;
  punchInTime : Date | null = null;
  punchOutTime : Date | null = null;
  todayTotalTime = 0;
  todayPunchIn: Date | null = null;
  toadyPunchOut: Date | null = null;
  
  // array of previous punches
  previousDays: {date: Date, totalTime: number}[] = []


  constructor(private router: Router, private punchService: PunchService){}

  ngOnInit() {
    // load punch history
    this.loadPunchHistory();
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
      this.todayPunchIn = this.punchInTime;
    })
  }

  // stop the timer
  punchOut(){
    this.punchService.punchOut().subscribe((response)=>{
      this.isPunchedIn = false;
      this.punchOutTime = new Date();
      this.toadyPunchOut = this.punchOutTime;

      if(this.punchInTime && this.punchOutTime){
        const timeDiff = Math.abs(this.punchOutTime.getTime() - this.punchInTime.getTime());
        this.todayTotalTime = Math.floor(timeDiff/(1000*60));   // time diff in minutes
        this.storeDayData();
      }
    });
  }


  storeDayData(){
    if(this.todayPunchIn && this.toadyPunchOut){
      this.previousDays.unshift({
        date: this.todayPunchIn,
        totalTime: this.todayTotalTime
      });
    }

    localStorage.setItem('previousDays', JSON.stringify(this.previousDays));
  }

  // load previous punch in
  loadPunchHistory(){
    this.punchService.getHistory().subscribe((history)=>{
      this.previousDays = history.map((entry)=>({
        date: new Date(entry.punchInTime),
        totalTime: entry.totalTime
      }))
      .filter(day => !isNaN(day.date.getTime()));
    })
  }




  logout(){
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
