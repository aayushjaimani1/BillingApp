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
import {
  NgbModal,
  ModalDismissReasons,
  NgbDatepickerModule
} from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  Validators
} from '@angular/forms';
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  private currBranch = ''
  private ajax: any
  products: Product[] = []
  closeResult = '';
  private formdata: any;
  product = this.fb.group({
    name: ['', Validators.required],
    sku: ['', Validators.required],
    category: ['', Validators.required],
    stock: ['', Validators.required],
    price: ['', Validators.required],
    image: ['', Validators.required]
  });
  addstock = this.fb.group({
    stock_sku: ['', Validators.required],
    stock_stock: ['', Validators.required]
  })


  constructor(private dService: DashboardService, private modalService: NgbModal, private fb: FormBuilder) {

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
      this.ajax = this.dService.getProduct(value, 0)
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
      if (pos >= max) {
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
  openModal(content: any) {
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
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  AddProduct(modal: any) {
    if (this.product.valid) {
      this.formdata = new FormData();
      for (const [key, value] of Object.entries(this.product.value)) {
        this.formdata.append(key, value)
      }
      this.formdata.append('branch', this.currBranch.replace(/[^a-zA-Z0-9\s]/g, ''))
      this.dService.addSingleProduct(this.formdata).subscribe((response: any) => {
          if (response == "success") {
            this.ajax = this.dService.getProduct(this.currBranch, 0)
            this.ajax.subscribe((response: any) => {
              if (response != 'No product found') {
                this.products = response
              } else {
                this.products = []
              }
            }, (error: string) => {
              console.log(error);
            })
            modal.close()
          } else {
            alert(response.error);
          }

        },
        (error: any) => {
          console.log(error);
        }
      )
    } else {
      alert("Some fields are empty");
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

  AddStock(modal: any){
    if(this.addstock.valid){
      this.formdata = new FormData()
      for(const [key, value] of Object.entries(this.addstock.value)){
        this.formdata.append(key, value)
      }
      this.formdata.append('branch', this.currBranch.replace(/[^a-zA-Z0-9\s]/g, ''))
      this.dService.addProductStock(this.formdata).subscribe((response: any) => {
        if(response == "success"){
          this.ajax = this.dService.getProduct(this.currBranch, 0)
            this.ajax.subscribe((response: any) => {
              if (response != 'No product found') {
                this.products = response
              } else {
                this.products = []
              }
            }, (error: string) => {
              console.log(error);
            })
            modal.close()
        }
        else{
          alert(response);
        }
      },
      (error:any)=>{
        console.log(error);
        
      })
    }
    else{
      alert("Some fields are empty");
    }
  }

}
