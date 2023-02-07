import { Component } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  progress = [
    {
      text: "text-primary",
      bg: "bg-primary"
    },
    {
      text: "text-light-sm",
      bg: "bg-light-sm"
    },
    {
      text: "text-light-sm",
      bg: "bg-light-sm"
    }
  ];
  signupForm = ["","d-none","d-none"];
  signupFormNo = 0;

  proceed(){
    if(this.signupFormNo == 0){
      this.signupForm[0] = "d-none";
      this.signupForm[1] = "";
      this.signupForm[2] = "d-none";
      this.progress[1].text = "text-primary";
      this.progress[1].bg = "bg-primary";
      this.signupFormNo++;
    }
    else{
      this.signupForm[0] = "d-none";
      this.signupForm[1] = "d-none";
      this.progress[2].text = "text-primary";
      this.progress[2].bg = "bg-primary";
      this.signupForm[2] = "";
      this.signupFormNo++;
    }
  }

  goBack(){
    if(this.signupFormNo == 1){
      this.signupForm[0] = "";
      this.signupForm[1] = "d-none";
      this.signupForm[2] = "d-none";
      this.progress[1].text = "text-light-sm";
      this.progress[1].bg = "bg-light-sm";
      this.signupFormNo--;
    }
    else{
      this.signupForm[0] = "d-none";
      this.signupForm[1] = "";
      this.signupForm[2] = "d-none";
      this.progress[2].text = "text-light-sm";
      this.progress[2].bg = "bg-light-sm";
      this.signupFormNo--;
    }
  }

  formReset(signup: HTMLFormElement){
    this.goBack();
    this.goBack();
    signup.reset();
  }
}