import {
  Component,
  HostListener,
  OnInit
} from '@angular/core';
import {
  fromEvent,
  Subscriber
} from 'rxjs';
import {
  DashboardService
} from '../dashboard.service';
import {
  Product
} from './product';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  private currBranch = ''
  private ajax: any
  products: Product[] = []


  constructor(private dService: DashboardService) {

  }

  ngOnInit(): void {
    this.currBranch = this.dService.branch
    this.ajax = this.dService.getProduct(this.currBranch, this.products.length)
    this.ajax.subscribe((response: any) => {
      if (response != 'No product found') {
        this.products = response
      } else {
        this.products = []
      }
    }, (error: string) => {
      console.log(error);
    })
    this.dService.onBranchNameStateChange.subscribe(value => {
      this.currBranch = value
      this.ajax = this.dService.getProduct(value, this.products.length)
      this.ajax.subscribe((response: any) => {
        if (response != 'No product found') {
          this.products = response
        } else {
          this.products = []
        }
      }, (error: string) => {
        console.log(error);
      })
    })

    fromEvent(document, "scroll").subscribe((event) => {
      let pos = document.documentElement.scrollTop + window.innerHeight;
      let max = document.documentElement.scrollHeight - 5;
      if(pos >= max){
        this.ajax = this.dService.getProduct(this.currBranch, this.products.length)
        this.ajax.subscribe((response: any) => {
          if (response != 'No product found') {
            this.products = this.products.concat(response)
          } else {
            this.products = []
          }
        }, (error: string) => {
          console.log(error);
        })
      }
      
    })
  }

}
