import {
  Component,
  HostListener,
  OnInit
} from '@angular/core';
import {
  NgbModal,
  ModalDismissReasons,
  NgbDatepickerModule
} from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  Validators
} from '@angular/forms';
import { Product } from '../add-product/product';
import { DashboardService } from '../dashboard.service';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss']
})
export class CouponComponent implements OnInit {

  closeResult = ""
  coupon = this.fb.group({
    coupon_id: [''],
    percentage: [''],
    min_amt: ['']
  })

  coupons: any = []

  constructor(private dService: DashboardService, private modalService: NgbModal, private fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.getCoupons()
  }

  addCoupon(modal:any){
    let data = new FormData()
    data.append("coupon",String(this.coupon.get("coupon_id")?.value))
    data.append("percentage",String(this.coupon.get("percentage")?.value))
    data.append("min_amount",String(this.coupon.get("min_amt")?.value))

    this.dService.addCouponReq(data).subscribe((response)=>{
      this.getCoupons()
      modal.close()
    })
  }

  getCoupons(){
    this.dService.getCoupons().subscribe((response)=>{
      this.coupons = response
    })
  }

  deleteCoupon(coupon_id: string){
    let data = new FormData()
    data.append("coupon_id", coupon_id)
    this.dService.deleteCoupon(data).subscribe((response)=>{
      this.getCoupons()
    })
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  stockModal(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title'
    }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

}

