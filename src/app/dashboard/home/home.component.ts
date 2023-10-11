import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  income = 0
  newUser = 0
  constructor(private dService: DashboardService){

  }
  ngOnInit(): void {
    this.dService.reportData().subscribe((response)=>{
      let sum = 0;
      let i =0
      for(i = 0 ; i < response.length; i++){
        sum += response[i][1]
      }
      this.income = sum
      this.newUser = i
    })
  }
}
