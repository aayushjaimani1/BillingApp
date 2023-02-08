import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  signupForm = ["","d-none","d-none"];
  signupFormNo = 0;
  noOfBranch = 0;

  billingSignupForm = this.fb.group({

    companyInformation: this.fb.group({
      gstNumber: [''],
      name: [''],
      address: [''],
      pincode: [''],
      industry: [''],
      state: ['']
    }),
    paymentInformation: this.fb.group({
      instamojoUsername: [''],
      privateAPIKey: [''],
      privateAuthToken: [''],
      privateSalt: [''],
      clientID: [''],
      ClientSecret: ['']
    }),
    branchInformation: this.fb.group({
      noBranch: [0],
      fields: this.fb.array([]),
      password: [''],
      cnfPassword: ['']
    })
  });

  constructor(private fb: FormBuilder){

  }

  updateFields(){
    let fields = this.billingSignupForm.get('branchInformation.fields') as FormArray;
    while(fields.length){
      fields.removeAt(0);
    }
    for(let i = 0 ; i < this.noOfBranch ; i++){
      fields.push(
        this.fb.group({
          field1: [''],
          field2: [''],
        })
      );
    }
  }


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

  branch(selectbranch:HTMLSelectElement){
    this.noOfBranch = Number(selectbranch.value);
    this.updateFields();
  }

  numSequence(n: number): Array<number> {
    return Array(n);
  }

  demo(signup: HTMLFormElement){
    console.log(this.billingSignupForm.value);
    this.formReset(signup);
  }
}