import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{
  private ajax: any;
  public username: string = "Welcome";
  constructor(private session: DashboardService, private router: Router){
    
  }
  ngOnInit(): void {
    this.ajax = this.session.checkSession();
    this.ajax.subscribe((response: any) =>{
      this.username = response.username;
    },
    (error: string) => {
      this.router.navigate(['/login']);
    }
    )
  }
}
