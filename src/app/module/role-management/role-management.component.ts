import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';

interface Role {
  id?: number;
  name?: string;
  description?: string;
}

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss']
})
export class RoleManagementComponent implements OnInit {
  roles: Role[] = [];
  roleDialog: boolean = false;
  roleForm: FormGroup;
  selectedRole: Role | undefined;
  searchTerm: string = '';

  constructor(private fb: FormBuilder, private confirmationService: ConfirmationService, private messageService: MessageService) {
    this.roleForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Mock roles data
    this.roles = [
      { id: 1, name: 'Admin', description: 'Administrator role with full permissions' },
      { id: 2, name: 'User', description: 'Standard user role with limited permissions' }
    ];
  }

  openNew() {
    this.roleForm.reset();
    this.selectedRole = undefined;
    this.roleDialog = true;
  }

  editRole(role: Role) {
    this.selectedRole = role;
    this.roleForm.patchValue(role);
    this.roleDialog = true;
  }

  deleteRole(role: Role) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + role.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.roles = this.roles.filter(r => r.id !== role.id);
        this.messageService.add({severity:'success', summary: 'Successful', detail: 'Role Deleted', life: 3000});
      }
    });
  }

  saveRole() {
    if (this.roleForm.valid) {
      if (this.selectedRole) {
        Object.assign(this.selectedRole, this.roleForm.value);
        this.messageService.add({severity:'success', summary: 'Successful', detail: 'Role Updated', life: 3000});
      } else {
        const newRole = { ...this.roleForm.value, id: this.roles.length + 1 };
        this.roles.push(newRole);
        this.messageService.add({severity:'success', summary: 'Successful', detail: 'Role Added', life: 3000});
      }
      this.roleDialog = false;
      this.roleForm.reset();
    }
  }

  hideDialog() {
    this.roleDialog = false;
    this.roleForm.reset();
  }
}
