import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeModel } from './model/employee';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  employeeForm: FormGroup = new FormGroup({});
  employeeObj:EmployeeModel = new EmployeeModel;
  employeeList: EmployeeModel[] = [];

  constructor(){
    
    this.createForm(); // first we initialise form control with model ts class

    const oldData = localStorage.getItem('EmpData');
    if(oldData != null){
      const parseData = JSON.parse(oldData);
      this.employeeList = parseData;
    }
  }

  createForm(){
    this.employeeForm = new FormGroup({
      empId: new FormControl(this.employeeObj.empId),
      emailId: new FormControl(this.employeeObj.emailId),
      name: new FormControl(this.employeeObj.name, [Validators.required, Validators.min(3)]),
      city: new FormControl(this.employeeObj.city),
      address: new FormControl(this.employeeObj.address),
      contactNo: new FormControl(this.employeeObj.contactNo),
      pinCode: new FormControl(this.employeeObj.pinCode),
      state: new FormControl(this.employeeObj.state),
    })
  }

  onSave(){
    const oldData = localStorage.getItem('EmpData');

    if(oldData != null){
      console.log('employeList when hitting onSave(): ' + this.employeeList);
      const parseData = JSON.parse(oldData);
      console.log(parseData.length);
      this.employeeForm.controls['empId'].setValue(parseData.length + 1);
      this.employeeList.unshift(this.employeeForm.value);
    } else {
      this.employeeList.unshift(this.employeeForm.value);
    }
    localStorage.setItem("EmpData", JSON.stringify(this.employeeList));

    // Reset the form for the next action
    this.reset();
  }

  onUpdate(){
    // Find the record in the employeeList array with the same empId as in the form
    const record = this.employeeList.find(m => m.empId == this.employeeForm.controls['empId'].value);

    if(record != undefined){
      // Update the record's properties with the values from the form
      record.emailId = this.employeeForm.controls['emailId'].value;
      record.name = this.employeeForm.controls['name'].value;
      record.contactNo = this.employeeForm.controls['contactNo'].value;
    }
    // Update the localStorage to persist the changes
    localStorage.setItem("EmpData", JSON.stringify(this.employeeList));

    // Reset the form for the next action
    this.reset();
  }

  onEdit(employee: EmployeeModel): void {
    
    this.employeeObj = employee;
    this.createForm();

  }

  onDelete(employeeId: number): void {

    const isDelete = confirm("Are you sure you want to delete");

    if(isDelete){
      const index = this.employeeList.findIndex(m => m.empId == employeeId)
      this.employeeList.splice(index, 1);
    }
    localStorage.setItem("EmpData", JSON.stringify(this.employeeList));
  }

  reset(){
    this.employeeObj = new EmployeeModel();
    this.createForm();
  }

}
