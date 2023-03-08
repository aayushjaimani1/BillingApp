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
    return this.http.get<Admin>("http://localhost/Projects/Epics%20Project/billing-system/server/Auth/Verify.php",{headers});
  }

  getBranches(): Observable<Admin>{
    const jwt = sessionStorage.getItem('_a_');
    const headers = new HttpHeaders().set('Authorization',`Bearer ${jwt}`);
    return this.http.get<Admin>("http://localhost/Projects/Epics%20Project/billing-system/server/Inventory/Branch.php",{headers});
  }

  getProduct(value: string, row: number): Observable<string>{
    const jwt = sessionStorage.getItem('_a_');
    const headers = new HttpHeaders().set('Authorization',`Bearer ${jwt}`);
    value = value.replace(/[^a-zA-Z0-9\s]/g, '')
    return this.http.get<string>(`http://localhost/Projects/Epics%20Project/billing-system/server/Inventory/GetProduct.php?branch=${value}&row=${row}`,{headers});
  }
}
