import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  private formdata: any;
  private ajax: any;
  public errorMessage = "";

  constructor(private fb: FormBuilder, private user: CommonService, private router: Router){

  }

  loginForm = this.fb.group({
    username: ['',Validators.required],
    password: ['',Validators.required]
  });

  get getUsername(){
    return this.loginForm.get('username');
  }

  get getPassword(){
    return this.loginForm.get('password');
  }

  loginUser(){
    if(this.loginForm.valid){
      this.formdata = new FormData();
      for(const [key, value] of Object.entries(this.loginForm.value)){
        this.formdata.append(key, value);
      }
      this.ajax = this.user.authLogin(this.formdata);
      this.ajax.subscribe((response: string) => {
        if(response.trim() != "API expects POST request." || response.trim() != "Username or email is wrong."){
          sessionStorage.setItem('_a_', response);
          this.router.navigate(['/dashboard']);
        }
        else{
          this.errorMessage = response;
          setTimeout(()=>{
            this.errorMessage = "";
          },2000)
        }
      },(error: string)=>{
        console.log(error);
      }
      );
    }
    else{
      alert("Please fill all the required fields.");
    }
  }
}
