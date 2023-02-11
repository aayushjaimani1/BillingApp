import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private fb: FormBuilder){

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
      console.log(this.loginForm.value);
      login.reset();
    }
    else{
      alert("Please fill all the required fields.");
    }
  }
}
