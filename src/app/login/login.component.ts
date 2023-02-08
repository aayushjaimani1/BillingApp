import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup;
  numbers = [2, 4, 6];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      numberOfFields: [2],
      fields: this.fb.array([
        this.fb.control(''),
        this.fb.control(''),
      ]),
    });

    this.form.get('numberOfFields')?.valueChanges.subscribe((number) => {
      const fields = this.form.get('fields') as FormArray;
      while (fields.length) {
        fields.removeAt(0);
      }
      for (let i = 0; i < number; i++) {
        fields.push(this.fb.control(''));
      }
    });
  }
  demo(){
    console.log(this.form.value)
  }
}
