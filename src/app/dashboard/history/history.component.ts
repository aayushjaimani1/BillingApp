import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit{

  invoices: any = []

  constructor(private dbService: DashboardService){
    
  }
  ngOnInit(): void {
    this.dbService.getInvoices().subscribe((response)=>{
      this.invoices = response
    })
  }
  @ViewChild('printableContent') printableContent!: ElementRef;
  printInvoice(id: string, printable: any){
    let data = new FormData()
    data.append("id",id)
    this.dbService.print(data).subscribe((response)=>{
      response = response.replace('\\',"")
      const printWindow = window.open('', '_blank');
      printWindow?.document.open();
      printWindow?.document.write(response);
      printWindow?.document.close();
      printWindow?.print();
    })
  }

}
