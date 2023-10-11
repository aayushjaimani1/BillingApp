import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Admin } from './admin';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  username: string = "";
  private branchName = "";
  onBranchNameStateChange = new Subject<string>();

  get branch(): string{
    return this.branchName
  }

  setbranchName(value: string){
    this.branchName = value
    this.onBranchNameStateChange.next(value)
  }

  checkSession(): Observable<Admin>{
    const jwt = sessionStorage.getItem('_a_');
    
    const headers = new HttpHeaders().set('Authorization',`Bearer ${jwt}`);
    return this.http.get<Admin>("http://localhost/Auth/Verify.php",{headers});
  }

  getBranches(): Observable<Admin>{
    const jwt = sessionStorage.getItem('_a_');
    const headers = new HttpHeaders().set('Authorization',`Bearer ${jwt}`);
    return this.http.get<Admin>("http://localhost/Inventory/Branch.php",{headers});
  }

  getProduct(value: string, row: number): Observable<string>{
    const jwt = sessionStorage.getItem('_a_');
    const headers = new HttpHeaders().set('Authorization',`Bearer ${jwt}`);
    value = value.replace(/[^a-zA-Z0-9\s]/g, '')
    return this.http.get<string>(`http://localhost/Inventory/GetProduct.php?branch=${value}&row=${row}`,{headers});
  }

  addSingleProduct(data: any): Observable<string>{
    const jwt = sessionStorage.getItem('_a_');
    const headers = new HttpHeaders().set('Authorization',`Bearer ${jwt}`)
    return this.http.post<string>(`http://localhost/Inventory/AddProduct.php`, data, {headers});
  }
  addProductStock(data: any): Observable<string>{
    const jwt = sessionStorage.getItem('_a_');
    const headers = new HttpHeaders().set('Authorization',`Bearer ${jwt}`)
    return this.http.post<string>(`http://localhost/Inventory/AddStock.php`, data, {headers});
  }

  addMultipleProduct(data: any): Observable<any>{
    const jwt = sessionStorage.getItem('_a_');
    const headers = new HttpHeaders().set('Authorization',`Bearer ${jwt}`)
    return this.http.post<string>(`http://127.0.0.1:5000/addproduct`, data, {headers});
  }

  deleteProduct(data: any): Observable<any>{
    const jwt = sessionStorage.getItem('_a_');
    const headers = new HttpHeaders().set('Authorization',`Bearer ${jwt}`)
    return this.http.post<string>(`http://127.0.0.1:5000/delete`, data, {headers});
  }

  getItemForInvoice(data: any): Observable<any>{
    const jwt = sessionStorage.getItem('_a_');
    const headers = new HttpHeaders().set('Authorization',`Bearer ${jwt}`)
    return this.http.post<any>(`http://127.0.0.1:5000/item`, data, {headers})
  }

  checkStock(data:any): Observable<any>{
    const jwt = sessionStorage.getItem('_a_');
    const headers = new HttpHeaders().set('Authorization',`Bearer ${jwt}`)
    return this.http.post<any>(`http://127.0.0.1:5000/checkStock`, data, {headers})
  }

  recommendedProduct(data: any): Observable<any>{
    const jwt = sessionStorage.getItem('_a_');
    const headers = new HttpHeaders().set('Authorization',`Bearer ${jwt}`)
    return this.http.post<any>(`http://127.0.0.1:5000/recommend`, data, {headers})
  }

  addCouponReq(data: any): Observable<any>{
    const jwt = sessionStorage.getItem('_a_');
    const headers = new HttpHeaders().set('Authorization',`Bearer ${jwt}`)
    return this.http.post<any>(`http://127.0.0.1:5000/addcoupon`, data, {headers})
  }

  getCoupons(): Observable<any>{
    const jwt = sessionStorage.getItem('_a_');
    const headers = new HttpHeaders().set('Authorization',`Bearer ${jwt}`)
    return this.http.post<any>(`http://127.0.0.1:5000/coupons`, "",{headers})
  }

  deleteCoupon(data: any): Observable<any>{
    const jwt = sessionStorage.getItem('_a_');
    const headers = new HttpHeaders().set('Authorization',`Bearer ${jwt}`)
    return this.http.post<any>(`http://127.0.0.1:5000/delcoupon`, data,{headers})
  }

  applyCoupon(data: any): Observable<any>{
    const jwt = sessionStorage.getItem('_a_');
    const headers = new HttpHeaders().set('Authorization',`Bearer ${jwt}`)
    return this.http.post<any>(`http://127.0.0.1:5000/apply`, data,{headers})
  }

  pay(data: any): Observable<any>{
    const jwt = sessionStorage.getItem('_a_');
    const headers = new HttpHeaders().set('Authorization',`Bearer ${jwt}`)
    return this.http.post<any>(`http://127.0.0.1:5000/pay_now`, data,{headers})
  }

  getInvoices(): Observable<any>{
    const jwt = sessionStorage.getItem('_a_');
    const headers = new HttpHeaders().set('Authorization',`Bearer ${jwt}`)
    return this.http.post<any>(`http://127.0.0.1:5000/invoices`, "",{headers})
  }

  print(data: any): Observable<any>{
    const jwt = sessionStorage.getItem('_a_');
    const headers = new HttpHeaders().set('Authorization',`Bearer ${jwt}`)
    return this.http.post<any>(`http://127.0.0.1:5000/print`, data,{headers})
  }

  reportData(): Observable<any>{
    const jwt = sessionStorage.getItem('_a_');
    const headers = new HttpHeaders().set('Authorization',`Bearer ${jwt}`)
    return this.http.post<any>(`http://127.0.0.1:5000/report`, "",{headers})
  }
  reportDailyData(): Observable<any>{
    const jwt = sessionStorage.getItem('_a_');
    const headers = new HttpHeaders().set('Authorization',`Bearer ${jwt}`)
    return this.http.post<any>(`http://127.0.0.1:5000/dailyreport`, "",{headers})
  }

  reportYearlyData(): Observable<any>{
    const jwt = sessionStorage.getItem('_a_');
    const headers = new HttpHeaders().set('Authorization',`Bearer ${jwt}`)
    return this.http.post<any>(`http://127.0.0.1:5000/yearlyreport`, "",{headers})
  }
}
