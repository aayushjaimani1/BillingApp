import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{
  constructor(private router: Router){
    
  }

  ngOnInit(): void {
    if(this.router.url == "/dashboard/add"){
      this.change([1,0])
    }
    else if(this.router.url == "/dashboard/invoice"){
      this.change([3,0])
    }
    else if(this.router.url == "/dashboard/consult"){
      this.change([4,0])
    }
    else if(this.router.url == "/dashboard/coupon"){
      this.change([2,0])
    }
    else if(this.router.url == "/dashboard/report"){
      this.change([5,0])
    }
    else if(this.router.url == "/dashboard/history"){
      this.change([6,0])
    }
  }

  public isCollapsed = true;
  public tab = ["active",""]
  public inventory = ["","",""]
  change(a: number[]){
    for(let i = 0 ; i < this.tab.length ; i++){
      this.tab[i] = ""
    }
    for(let i = 0 ; i < this.inventory.length ; i++){
      this.inventory[i] = ""
    }
    this.isCollapsed = true;
    this.tab[a[0]] = "active";
    if(a[0] == 1){
      for(let i = 0 ; i < this.inventory.length ; i++){
        this.inventory[i] = ""
      }
      this.inventory[a[1]] = "active";
      this.isCollapsed = false;
    }
    
  }

  toggleTab(){

  }
}
