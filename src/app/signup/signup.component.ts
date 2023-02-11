import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {



  // variables
  signupForm = ["","d-none","d-none"];
  private signupFormNo = 0;
  noOfBranch = 0;
  errorAlert = "d-none";
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

  billingSignupForm = this.fb.group({

    companyInformation: this.fb.group({
      gstNumber: ["",[Validators.required,Validators.minLength(15),Validators.pattern('[0-9]*')]],
      name: ['',[Validators.required,Validators.minLength(8)]],
      address: ['',Validators.required],
      pincode: ['',[Validators.required,Validators.minLength(6),Validators.pattern('[0-9]*')]],
      industry: ['',Validators.required],
      state: ['',Validators.required]
    }),
    paymentInformation: this.fb.group({
      instamojoUsername: ['',Validators.required],
      privateAPIKey: ['',Validators.required],
      privateAuthToken: ['',Validators.required],
      privateSalt: ['',Validators.required],
      clientID: ['',Validators.required],
      ClientSecret: ['',Validators.required]
    }),
    branchInformation: this.fb.group({
      noBranch: [0],
      fields: this.fb.array([]),
      password: ['',[Validators.required,Validators.minLength(8)]],
      email: ['',[Validators.email,Validators.required]]
    })
  });



  // constructor
  constructor(private fb: FormBuilder, private http: HttpClient){
    
  }

  // lifecycle hook 
  ngOnInit(): void {
    
  }



  // getters
  get gstNumber(){
    return this.billingSignupForm.get('companyInformation.gstNumber');
  }

  get getName(){
    return this.billingSignupForm.get('companyInformation.name');
  }

  get getAddress(){
    return this.billingSignupForm.get('companyInformation.address');
  }

  get getPincode(){
    return this.billingSignupForm.get('companyInformation.pincode');
  }

  get getIndustry(){
    return this.billingSignupForm.get('companyInformation.industry');
  }

  get getState(){
    return this.billingSignupForm.get('companyInformation.state');
  }

  get getInstamojo(){
    return this.billingSignupForm.get('paymentInformation.instamojoUsername');
  }

  get getPrivateAPIKey(){
    return this.billingSignupForm.get('paymentInformation.privateAPIKey');
  }

  get getPrivateAuthToken(){
    return this.billingSignupForm.get('paymentInformation.privateAuthToken');
  }
  
  get getPrivateSalt(){
    return this.billingSignupForm.get('paymentInformation.privateSalt');
  }

  get getClientID(){
    return this.billingSignupForm.get('paymentInformation.clientID');
  }

  get getClientSecret(){
    return this.billingSignupForm.get('paymentInformation.ClientSecret');
  }

  get getPassword(){
    return this.billingSignupForm.get('branchInformation.password');
  }

  get getEmail(){
    return this.billingSignupForm.get('branchInformation.email');
  }



  // functions

  private updateFields(): void{
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

  proceed(): void{
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

  goBack(): void{
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

  private formReset(signup: HTMLFormElement): void{
    this.goBack();
    this.goBack();
    signup.reset();
  }

  branch(selectbranch:HTMLSelectElement): void{
    this.noOfBranch = Number(selectbranch.value);
    this.updateFields();
  }

  numSequence(n: number): Array<number> {
    return Array(n);
  }

  CreateUser(signup: HTMLFormElement){
    if(this.billingSignupForm.valid){
      console.log(this.billingSignupForm.value)
      this.formReset(signup);
    }
    else{
      this.errorAlert = "";
      setTimeout(()=> {
        this.errorAlert = "d-none";
      },5000);
    }
    
  }
}