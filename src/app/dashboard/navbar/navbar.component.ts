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
