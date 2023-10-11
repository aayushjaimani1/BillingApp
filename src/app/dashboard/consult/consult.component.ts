import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-consult',
  templateUrl: './consult.component.html',
  styleUrls: ['./consult.component.scss']
})
export class ConsultComponent {

  products: any = []

  constructor(private fb: FormBuilder, private dbService: DashboardService){

  }

  consultForm = this.fb.group({
    brand: [''],
    color: [''],
    battery: [0],
    max_price: [0]
  })

  getRecommendation(){
    let data = new FormData()
    data.append("brand",String(this.consultForm.get("brand")?.value))
    data.append("color",String(this.consultForm.get("color")?.value))
    data.append("battery_life",String(this.consultForm.get("battery")?.value))
    data.append("max_price",String(this.consultForm.get("max_price")?.value))
    this.dbService.recommendedProduct(data).subscribe((response)=>{
      for(let i = 0; i < 5; i++){
        this.products.pop()
      }
      for(let i = 0; i < 5; i++){
        this.products.push({
          link: response['Best Buy Link'][i],
          color: response['Colour'][i],
          model: response['Model'][i],
          price: response['Price'][i],
          ram: response['RAM'][i],
          size: response['Size'][i]
        })
      }

    })
  }
}
