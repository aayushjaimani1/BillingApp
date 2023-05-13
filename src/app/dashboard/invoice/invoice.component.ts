import { Component, ViewChild, ElementRef } from '@angular/core';
import { Item } from './item';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent {
  items: Item[]= [];

  constructor(private dbService: DashboardService){

  }

  addField(){
    if(this.items.length == 0){
      this.items.push({
        id: "Enter Id",
        name: "",
        price: 0,
        quantity: 1,
        amount: 0
      })
    }
    else{
      let itm = "item-"+ (this.items.length - 1);
      let add_item = document.getElementsByClassName(itm);
      this.items.pop();
      this.items.push({
        id: add_item[0].innerHTML,
        name: add_item[1].innerHTML,
        price: Number(add_item[2].innerHTML),
        quantity: Number(add_item[3].innerHTML),
        amount: Number(add_item[4].innerHTML)
      });
      this.items.push({
        id: "123",
        name: "123",
        price: 123,
        quantity: 1,
        amount: 123
      })
      console.log(this.items)
    }

    
  }
  getItem(ele: string){
    let data = new FormData();
    data.append("id",ele)
    let branch = this.dbService.branch.replace(/[^a-zA-Z0-9\s]/g, '')
    console.log(branch);
    
    data.append("branch", branch)
    this.dbService.getItemForInvoice(data).subscribe((response)=>{
      
      let itm = "item-"+ (this.items.length - 1);
      let add_item = document.getElementsByClassName(itm);
      add_item[1].innerHTML = response[0]['name']
      add_item[2].innerHTML = response[0]['amt'].replace("$","")
      add_item[4].innerHTML = response[0]['amt'].replace("$","")
    })
  }

  calculateAmount(qty: string, pri: string){
    let amt = Number(qty) * Number(pri.replace("$",""))
    console.log(amt);
    let itm = "item-"+ (this.items.length - 1);
    let add_item = document.getElementsByClassName(itm);
    add_item[4].innerHTML = amt.toFixed(2) + ""
    
  }
}
