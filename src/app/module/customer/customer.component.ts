import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit{

  supplierForm: FormGroup;
  supplierBankForm : FormGroup;

  constructor(private fb: FormBuilder) {
    this.supplierForm = this.fb.group({
      supplier_id: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      Tax_Id: ['', Validators.required],
      address: ['', Validators.required],
      district: ['', Validators.required],
      subdistrict: ['', Validators.required],
      province: ['', Validators.required],
      postal: ['', Validators.required],
      tel: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      supplier_num:['', [Validators.required, Validators.email]],
      supplier_type:['', [Validators.required, Validators.email]],
      site:['', [Validators.required, Validators.email]],
    });
    this.supplierBankForm = this.fb.group({
      name_bank: ['', Validators.required],
      branch: ['', Validators.required],
      account_num: ['', Validators.required],
      account_name: ['', Validators.required],
      vat: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.supplierForm.valid) {
      console.log(this.supplierForm.value);
      // Add your code to save the data to the database here
    } else {
      console.log('Form is invalid');
    }
  }
  onSubmitBank() {
    if (this.supplierBankForm.valid) {
      console.log(this.supplierBankForm.value);
      // Code to save the bank data to the database goes here
    } else {
      console.log('Form is invalid');
    }
  }
}
  


