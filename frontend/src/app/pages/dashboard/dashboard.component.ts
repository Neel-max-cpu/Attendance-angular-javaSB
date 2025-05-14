import { Component, isSignal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PunchService } from '../../services/punch.service';
import { NgIf, NgFor, DatePipe } from '@angular/common';


// for exporting --
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


// icons -
import { LucideAngularModule, TicketCheck, TicketMinus,LogOut,OctagonAlert,Download} from 'lucide-angular';

// components -
import { DatePicker  } from 'primeng/datepicker';


// custom alert --
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  imports: [    
    LucideAngularModule,
    NgIf,
    NgFor,
    DatePicker,
    DatePipe,    
  ],
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  readonly TicketCheck = TicketCheck;
  readonly TicketMinus  = TicketMinus ;
  readonly LogOut = LogOut ;
  readonly OctagonAlert  = OctagonAlert;
  readonly Download = Download;
  

  isPunchedIn = false;
  todaydate = true;
  punchInTime : Date | null = null;
  punchOutTime : Date | null = null;
  todayTotalTime = 0;

  // for live timer
  timerInterval: any;
  elapsedTime: string = '';
  hasShown12HourWarning = false;
  hasShown14HourWarning = false;
  
  punches: { punchIn: string, punchOut: string }[] = [];
  selectedDate: Date = new Date();
  noData : boolean = false;  


  constructor(
    private router: Router, 
    private punchService: PunchService,     
  ){}

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
        if(err.error && err.error.message === "Punch out rejected: more than 14 hours have passed!"){
          this.stopTimer();
          // alert("Punch-out rejected: more than 14 hours has passed!");
          Swal.fire({
            title: 'Error',
            text: 'Punch-out rejected: more than 14 hours has passed!',            
            icon:'error',
          })
        }
        else{
          this.stopTimer();
          console.log("Failed to punch out!", err);
          // alert("An error had occured while punching out!");
          let errorMessage = err.error;
          Swal.fire({
            title: 'Error',
            text: errorMessage,            
            icon:'error',
          })
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
    // 24hr format
    /*
    const hours = date.getHours().toString().padStart(2, '0');
    const mins = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${mins}`;
    */
    // 12hr am/pm format
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  getFormattedTotalTime(): string {
    const hours = Math.floor(this.todayTotalTime / 60);
    const mins = this.todayTotalTime % 60;
    return `${hours}h ${mins}m`;
  }

  startTimer(){
    this.hasShown12HourWarning = false;
    this.hasShown14HourWarning = false;
    this.updateElapsedTime();
    this.timerInterval = setInterval(()=>{
      this.updateElapsedTime();
    }, 1000);
  }

  stopTimer(){
    clearInterval(this.timerInterval);
    this.timerInterval = null;
    this.elapsedTime = '';
    this.hasShown12HourWarning = false;
    this.hasShown14HourWarning = false;
  }

  updateElapsedTime(){
    if(this.punchInTime){
      const now = new Date();
      const diffMs = now.getTime() - this.punchInTime.getTime();
      const hours = Math.floor(diffMs / 3600000);
      const minutes = Math.floor((diffMs % 3600000) / 60000);
      const seconds = Math.floor((diffMs % 60000) / 1000);
      this.elapsedTime = `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;

      // check for 12 hours
      if(hours>12 && hours<14 && !this.hasShown12HourWarning){
        // alert("Warning: You have punched in for more than 12 hours!")
        Swal.fire({
          title: 'Warning',
          text: 'You have punched in for more than 12 hours!',            
          icon:'warning',
        })
        this.hasShown12HourWarning = true;
      }
      
      // check for 14 hours
      if(hours>=14 && !this.hasShown14HourWarning){
        // alert("Warning: You have punched in for more than 14 hours! Your time is invalid!")
        Swal.fire({
          title: 'Warning',
          text: 'You have punched in for more than 14 hours! Your time is invalid!',            
          icon:'warning',
        })
        this.hasShown12HourWarning = false;
        this.hasShown14HourWarning = true;
      }

    }
  }

  pad(n: number): string {
    return n < 10 ? '0' + n : n.toString();
  }

  exportData() {
    // console.log('Punches:', this.punches);  
    Swal.fire({
      title: 'Export as?',
      text: 'Choose your export format',
      showDenyButton: true,
      confirmButtonText: 'PDF',
      denyButtonText: `Excel`,
      icon:'success',
    }).then((result) => {
      if (result.isConfirmed) {
        this.exportAsPDF();
      } else if (result.isDenied) {
        this.exportAsExcel();
      }
    });
  }
  
  exportAsPDF() {
    const doc = new jsPDF();
    // 10,10 is point in the graph like top left is 0,0 we are starting from 10,10
    doc.text(`Punch History date: ${this.formatDate(this.selectedDate)}`, 10, 10);
    let hours = Math.floor(this.todayTotalTime/60);
    let mins = this.todayTotalTime%60;
    doc.text(`Total Time Given: ${hours ? `${hours} hr ${mins} mins` : `${mins} mins`}`, 10, 20);

  
    const tableData = this.punches.map(p => [
      this.formatTime(new Date(p.punchIn)),
      p.punchOut ? this.formatTime(new Date(p.punchOut)) : '-'
    ]);
  
    autoTable(doc, {
      head: [['Punch In', 'Punch Out']],
      body: tableData,
      startY: 30,
      // styling below ---
      styles: { font: 'helvetica', fontSize: 10, cellPadding: 5 },
      headStyles: { fillColor: [22, 160, 133], textColor: [255, 255, 255] }, // Style for header
      alternateRowStyles: { fillColor: [240, 240, 240] }, // Alternate row color
    });

     // === Preview in new tab ===
    const pdfBlob = doc.output('blob'); // Get blob version
    const blobUrl = URL.createObjectURL(pdfBlob); // Create object URL
    window.open(blobUrl); // Open in new tab
    
    // and then save ---
    // doc.save(`Punch_History_${this.formatDate(this.selectedDate)}.pdf`);
  }
  
  exportAsExcel() {
    const worksheetData = this.punches.map(p => ({
      'Punch In': this.formatTime(new Date(p.punchIn)),
      'Punch Out': p.punchOut ? this.formatTime(new Date(p.punchOut)) : '-'
    }));
    
     // Create a worksheet from the data
    const ws = XLSX.utils.json_to_sheet(worksheetData);
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Punch History');
  
    XLSX.writeFile(wb, `Punch_History_${this.formatDate(this.selectedDate)}.xlsx`);
  }
  


  logout(){
    Swal.fire({
      title: 'Are You Sure',
      text: 'Do you really want to logout!',
      showDenyButton: true,
      confirmButtonText: 'Logout',
      denyButtonText: `Cancel`,
      icon:'warning',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Success',
          text: 'Logged out successfully!',                              
          icon:'success',
        }).then(()=>{
          // remove the token and redirected to login
          localStorage.removeItem('token');      
          this.router.navigate(['/login']);
        })
      } 
    });
  }
}
