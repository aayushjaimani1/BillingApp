import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  private formdata: any;
  private ajax: any;

  constructor(private fb: FormBuilder, private user: CommonService){

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

  loginUser(login: HTMLFormElement){
    if(this.loginForm.valid){
      this.formdata = new FormData();
      for(const [key, value] of Object.entries(this.loginForm.value)){
        this.formdata.append(key, value);
      }
      this.ajax = this.user.authLogin(this.formdata);
      this.ajax.subscribe((response: string) => {
        console.log(response);
      },(error: string)=>{
        console.log("error");
      }
      );
    }
    else{
      alert("Please fill all the required fields.");
    }
  }
}
