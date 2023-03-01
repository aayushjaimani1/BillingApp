import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Admin } from './admin';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  username: string = "";

  checkSession(): Observable<Admin>{
    const jwt = sessionStorage.getItem('_a_');
    
    const headers = new HttpHeaders().set('Authorization',`Bearer ${jwt}`);
    return this.http.get<Admin>("http://localhost/Projects/Epics%20Project/billing-system/server/Auth/Verify.php",{headers});
  }


}
