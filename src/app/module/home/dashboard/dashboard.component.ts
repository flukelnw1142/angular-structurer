import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

interface MockData {
  id: number;
  name: string;
}
interface User {
  firstName: string;
  lastName: string;
  status: string;
  statusdoc: string;
  statussync: string;
}
@Component({
  standalone:true,
  imports:[  CommonModule,
    ReactiveFormsModule,
    TableModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    CardModule],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  imageUrl = './assets/images/logo/logo-one-e.png';
  user = {
    firstName: 'ทดสอบ',
    lastName: 'Test',
    status: 'Approve',
    statussync: 'Success',
    statusdoc: 'submit'
  };
  mockDataList: MockData[] = [];
  users: User[] = [];
  constructor() {
    this.mockDataList = [
    { id: 1, name: 'Option 1' },
    { id: 2, name: 'Option 2' },
    { id: 3, name: 'Option 3' },
    { id: 4, name: 'Option 4' }

    
  ];

  this.users = [ 
  {
    firstName: 'ทดสอบ',
    lastName : 'Test',
    status : 'Approved',
    statussync : 'Success',
    statusdoc : 'submit'
  },
  {
    firstName: 'ทดสอบ2',
    lastName : 'Test2',
    status : 'Approved',
    statussync : 'Success',
    statusdoc : 'Draft'
  },
 
];
}
onEdit(user: User): void {
  // Handle edit action
  console.log('Edit clicked for:', user);
}

onSubmit(user: User): void {
  // Handle submit action
  console.log('Submit clicked for:', user);
} 

}
