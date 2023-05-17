import { Component, ViewChild, ElementRef } from '@angular/core';
import { Item } from './item';
import { DashboardService } from '../dashboard.service';
import { count } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent {
  items: Item[]= [];
  subtotal= 0;
  coupon_discount = 0;
  cgst = 0;
  sgst = 0;
  grand_total = 0;
  addItem = this.fb.group({
    product_id: [''],
    product_qty: [1]
  })

  coupon = this.fb.group({
    coupon_id: ['']
  })

  resultResponse = ""

  customerDetails = this.fb.group({
    fname: [''],
    lname: [''],
    address: [''],
    email: [''],
    phone: ['']
  })

  constructor(private dbService: DashboardService, private fb: FormBuilder, private router: Router){

  }

  payNow(){
    let data = new FormData()
    data.append("customer_details",JSON.stringify(this.customerDetails.value))
    data.append("product_in_cart", JSON.stringify(this.items))
    data.append("branch",this.dbService.branch.replace(/[^a-zA-Z0-9\s]/g, ''))
    let summary = {
      subtotal: this.subtotal,
      discount: this.coupon_discount,
      sgst: this.sgst,
      cgst: this.cgst,
      total: this.grand_total,
    }
    data.append("summary", JSON.stringify(summary))
    this.dbService.pay(data).subscribe((response)=>{
      window.location.href = response
    })
  }

  addField(name:any, price: any, amt: any, additemform: any){
    this.items.push({
      id: String(this.addItem.get('product_id')?.value),
      name: name.innerHTML,
      price: Number(price.innerHTML.replace("$","")),
      quantity: Number(String(this.addItem.get('product_qty')?.value)),
      amount: Number(amt.innerHTML.replace("$",""))
    });
    additemform.reset()
    name.innerHTML = "Product Name"
    price.innerHTML = "Product Price"
    amt.innerHTML = "Product Amount"
    this.calculate()
  }

  getItem(name: any, price: any, amt: any){
    let data = new FormData();
    data.append("id",String(this.addItem.get('product_id')?.value))
    let branch = this.dbService.branch.replace(/[^a-zA-Z0-9\s]/g, '')
    console.log(branch);
    
    data.append("branch", branch)
    this.dbService.getItemForInvoice(data).subscribe((response)=>{
      if(response == "error"){
        alert("Wrong Product Id or Product Out Of Stock")
      }
      else{
        name.innerHTML = response[0].name
        amt.innerHTML = response[0].amt
        price.innerHTML = response[0].amt
      }
    })
  }

  calculateAmount(pri: string, amts: any){
    let data = new FormData();
    data.append("id",String(this.addItem.get('product_id')?.value))
    let branch = this.dbService.branch.replace(/[^a-zA-Z0-9\s]/g, '')
    data.append("branch",branch)
    data.append("qty",String(this.addItem.get('product_qty')?.value))
    this.dbService.checkStock(data).subscribe((response)=>{
      if(response >= Number(this.addItem.get('product_qty')?.value)){
        let amt = Number(this.addItem.get('product_qty')?.value) * Number(pri.replace("$",""))
        amts.innerHTML = "$" + amt.toFixed(2) + ""
      }
      else{
        alert("Out Of Stock")
      }
    })
  }

  deleteItem(sku: string){
    let count = 0
    for(let i of this.items){
      if(i.id == sku){
        this.items.splice(count,1)
      }
      count++
    }
    this.calculate()
  }

  calculate(){
    let amt = 0
    for(let item of this.items){
      amt += item.amount
    }
    this.subtotal = amt;
    this.cgst = Number((0.09 * this.subtotal).toFixed(2));
    this.sgst = Number((0.09 * this.subtotal).toFixed(2));
    this.grand_total = Number(((this.subtotal - this.coupon_discount) + this.cgst + this.sgst).toFixed(2))
    
  }

  applyCoupon(){
    let data = new FormData()
    data.append("coupon_id",String(this.coupon.value['coupon_id']))
    this.dbService.applyCoupon(data).subscribe((response)=>{
      if(response.length == 0){
        this.resultResponse = "Please enter valid coupon id"
        this.coupon_discount = 0
        this.calculate()
      }
      else{
        if(Number(response[0].min_value) <= this.subtotal){
          this.resultResponse = "Coupon " + response[0].coupon_id + " Applied"
          this.coupon_discount = Number(response[0].percentage)
          this.coupon_discount = (this.coupon_discount / 100) * this.subtotal
          this.calculate()
        }
        else{
          this.resultResponse = "Min Buy " + response[0].min_value
          this.coupon_discount = 0
          this.calculate()
        }
        
      }
    })
  }
}
