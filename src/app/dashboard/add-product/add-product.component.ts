import {
  Component,
  OnInit
} from '@angular/core';
import {
  DashboardService
} from '../dashboard.service';
import { Product } from './product';

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
    this.ajax = this.dService.getProduct(this.currBranch)
    this.ajax.subscribe((response: any) => {
      if(response != 'No product found'){
        this.products = response
      }
      else{
        this.products = []
      }
    }, (error: string) => {
      console.log(error);
    })
    this.dService.onBranchNameStateChange.subscribe(value => {
      this.ajax = this.dService.getProduct(value)
      this.ajax.subscribe((response: any) => {
        if(response != 'No product found'){
          this.products = response
        }
        else{
          this.products = []
        }
      }, (error: string) => {
        console.log(error);
      })
    })
  }

}
