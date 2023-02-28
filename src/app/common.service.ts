import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient) {
  
  }

  authSignup(data: any): Observable<string>{
    return this.http.post<string>("http://localhost/Projects/Epics%20Project/billing-system/server/Auth/Signup.php", data).pipe(catchError(this.handleError));
  }

  authLogin(data: any): Observable<string>{
    return this.http.post<string>("http://localhost/Projects/Epics%20Project/billing-system/server/Auth/Login.php", data).pipe(catchError(this.handleError));
  }
  
  handleError(error: HttpErrorResponse): Observable<any>{
    if(error.error instanceof ErrorEvent){
      return throwError("Network Error");
    }
    else if(error.status == 404){
      return throwError("Not Found");
    }
    else if(error.status == 400){
      return throwError("Bad Request");
    }
    return throwError("Something went wront please try again");
    
  }
}
