import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { Router } from '@angular/router';
import { Admin } from './admin';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{
  private ajax: any;
  constructor(private session: DashboardService, private router: Router){
    
  }
  ngOnInit(): void {
    if(sessionStorage.getItem('_a_')){
      this.ajax = this.session.checkSession();
      this.ajax.subscribe((response: Admin) =>{
        this.session.username = response.username;
      },
      (error: string) => {
        this.router.navigate(['/login']);
      }
      )
    }
    else{
      this.router.navigate(['/login']);
    }
    
  }
}
