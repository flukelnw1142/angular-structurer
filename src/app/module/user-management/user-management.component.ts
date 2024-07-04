import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';

interface User {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
  status?: string;
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  userDialog: boolean = false;
  userForm!: FormGroup;
  roles: any[] = [{label: 'Admin', value: 'admin'}, {label: 'User', value: 'user'}];
  statuses: any[] = [{label: 'Active', value: 'active'}, {label: 'Inactive', value: 'inactive'}];
  selectedUser: User | undefined;
  searchTerm: string = '';

  constructor(private fb: FormBuilder, private confirmationService: ConfirmationService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      status: ['', Validators.required]
    });

    // Mock users data
    this.users = [
      { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'admin', status: 'active' },
      { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'user', status: 'inactive' }
    ];
  }

  openNew() {
    this.userForm.reset();
    this.selectedUser = undefined;
    this.userDialog = true;
  }

  editUser(user: User) {
    this.selectedUser = user;
    this.userForm.patchValue(user);
    this.userDialog = true;
  }

  deleteUser(user: User) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + user.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.users = this.users.filter(u => u.id !== user.id);
        this.messageService.add({severity:'success', summary: 'Successful', detail: 'User Deleted', life: 3000});
      }
    });
  }

  saveUser() {
    if (this.userForm.valid) {
      if (this.selectedUser) {
        Object.assign(this.selectedUser, this.userForm.value);
        this.messageService.add({severity:'success', summary: 'Successful', detail: 'User Updated', life: 3000});
      } else {
        const newUser = { ...this.userForm.value, id: this.users.length + 1 };
        this.users.push(newUser);
        this.messageService.add({severity:'success', summary: 'Successful', detail: 'User Added', life: 3000});
      }
      this.userDialog = false;
      this.userForm.reset();
    }
  }

  hideDialog() {
    this.userDialog = false;
    this.userForm.reset();
  }
}
