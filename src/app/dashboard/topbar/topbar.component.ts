import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { Admin } from '../admin';
import { Router } from '@angular/router';
import { Branch } from './branch';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit{
  public username: string = "";
  ajax: any;
  brachReq: any;
  branches: Branch[] = [];
  constructor(private session: DashboardService, private router: Router){

  }

  ngOnInit(): void {

    if(sessionStorage.getItem('_a_')){
      this.ajax = this.session.checkSession();
      this.ajax.subscribe((response: Admin) =>{
        this.username = response.username;
        this.brachReq = this.session.getBranches();
        this.brachReq.subscribe((response:any)=>{
          console.log(response);
          
          this.branches = response;
        })
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
