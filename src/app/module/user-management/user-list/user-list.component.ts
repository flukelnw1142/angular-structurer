import { UserService } from './../service/user.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Role } from 'src/app/shared/interfaces/role.interface';
import { PrimeNgModule } from 'src/app/shared/primeng.module';
import { UserList } from 'src/app/shared/interfaces/user-list.interface';
import { FilterPipe } from 'src/app/shared/pipes/filter.pipe';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { SharedAppModule } from 'src/app/shared/shared-app.module';
import { ToastService } from 'src/app/shared/services/toast.service';
import { RoleService } from '../../role-management/service/role.service';
import { BusTerminalService } from '../../bus-terminal-management/service/bus-terminal.service';
import { BusTerminal } from 'src/app/shared/interfaces/bus-terminal.interface';
import { BusLineService } from '../../bus-lines-management/service/bus-line.service';
import { BusLines } from 'src/app/shared/interfaces/bus-lines.interface';

interface Prefix {
  prefix: string;
  code: string;
}
interface Shift {
  name: string;
  value: string;
}
@Component({
  standalone: true,
  selector: 'app-user-list',
  imports: [
    PrimeNgModule,
    SharedAppModule,

  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  private _roleService: RoleService;
  private _userService: UserService;
  private _busTerminalService = inject(BusTerminalService);
  private _busLineService = inject(BusLineService);

  private _changeDetectorRef: ChangeDetectorRef;
  private fb: FormBuilder;
  private _toastService: ToastService;

  searchText: string | null = null;
  dataUsers: UserList[] = [];
  sidebar = false;
  registerForm!: FormGroup;
  submittedForm$ = new BehaviorSubject<boolean>(false);
  prefix: Prefix[] = [];
  actionStatus: string = "save";
  dataRoles: Role[] = [];
  shifts: Shift[] = []
  constructor(
    private confirmationService: ConfirmationService,
    roleService: RoleService,
    userService: UserService,
    changeDetectorRef: ChangeDetectorRef,
    fb: FormBuilder,
    toastService: ToastService
  ) {

    this._roleService = roleService;
    this._userService = userService;
    this._changeDetectorRef = changeDetectorRef;
    this.fb = fb;
    this._toastService = toastService;
    this.createForm();
  }

  ngOnInit(): void {
    this.registerForm.get('platform')?.disable()
    // this.switchUserType('BUSLINESEMP')
    // this.switchPlatform('WEBSITE')
    this.shifts = [
      { name: 'กะเช้า', value: 'กะเช้า' },
      { name: 'กะบ่าย', value: 'กะบ่าย' },
      { name: 'กะสว่าง', value: 'กะสว่าง' },

    ];

    this.prefix = [
      { prefix: 'นาย', code: 'นาย' },
      { prefix: 'นางสาว', code: 'นางสาว' },
      { prefix: 'นาง', code: 'นาง' },
    ];
    this.getUser();

  }
  busTerminals: BusTerminal[] = [];
  getBusTerminal() {
    this._busTerminalService.search().subscribe({
      next: (response: any) => {
        const data: any = response;
        this.busTerminals = data['data']
        this._changeDetectorRef.markForCheck()
      },
      error: (err) => {

      }
    });
  }

  busLines: BusLines[] = [];
  getBusLines() {
    this._busLineService.search().subscribe({
      next: (response: any) => {
        const data: any = response;
        this.busLines = data['data']
        this._changeDetectorRef.markForCheck()
      },
      error: (err) => {

      }
    });
  }



  createForm(): void {
    this.registerForm = this.fb.group({
      platform: new FormControl<string | null>(null, Validators.required),
      username: new FormControl<string | null>(null, Validators.required),
      password: new FormControl<string | null>(null, Validators.required),
      buslinesId: new FormControl<string | null>(null, Validators.required),
      userType: new FormControl<string | null>('BUSLINESEMP', Validators.required),
      busTerminalId: new FormControl<string | null>(null),
      employeeShift: new FormControl<string | null>(null, Validators.required),
      employeeStatus: new FormControl<string | null>(null),
      confirmPassword: new FormControl<string | null>(null),
      roleCode: new FormControl<string | null>(null, Validators.required),
      firstName: new FormControl<string | null>(null, Validators.required),
      lastName: new FormControl<string | null>(null, Validators.required),
      prefix: new FormControl<string | null>(null, Validators.required),
      email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
      phoneNumber: new FormControl<string | null>(null, Validators.required),
      position: new FormControl<string | null>(null, Validators.required),
    });
  }

  getRole(platform: string): void {
    this._roleService.getRoleList().subscribe({
      next: (response: any) => {
        const data: any = response;
        this.dataRoles = data['data'];
        // const filteredRoles = this.filterRolesByPlatform(this.dataRoles, platform);
        // this.dataRoles = filteredRoles;
        this._changeDetectorRef.markForCheck();
      },
      error: (err) => {
        // Handle error
      },
    });
  }
  userStatusCheck(status: string): string {
    if (status == "UNAVAILABLE") {
      return "อยู่ระหว่างดำเนินงาน"
    }
    return "พร้อมดำเนินงาน"
  }


  getCategoryData(data: any) {
    const filteredRoles = this.filterRolesByPlatform(this.dataRoles, data['value']);
    if ("EMPLOYEE" === filteredRoles[0].userCategoryCode) {
      this.switchPlatform('WEBSITE')
    } else {
      this.switchPlatform('APPLICATION')
    }
    this.registerForm.get('userType')?.patchValue(filteredRoles[0].userCategoryCode)
    if (filteredRoles[0].userCategoryCode == "BUSLINESEMP") {
      this.registerForm.get('busTerminalId')?.reset()
      this.registerForm.get('employeeShift')?.reset()
      this.registerForm.get('buslinesId')?.reset()
      this.registerForm.get('busTerminalId')?.clearValidators();
      this.registerForm.get('busTerminalId')?.updateValueAndValidity();
      this.registerForm.get('buslinesId')?.addValidators([Validators.required])
      this.registerForm.get('buslinesId')?.updateValueAndValidity();
      this.registerForm.get('employeeShift')?.addValidators([Validators.required])
      this.registerForm.get('employeeShift')?.updateValueAndValidity();
      this.registerForm.get('busTerminalId')?.disable()
      this.registerForm.get('buslinesId')?.enable()
      this.registerForm.get('employeeShift')?.enable()
      this._changeDetectorRef.markForCheck();
    } else if (filteredRoles[0].userCategoryCode == "BUSTERMINALEMP") {
      this.registerForm.get('busTerminalId')?.reset()
      this.registerForm.get('employeeShift')?.reset()
      this.registerForm.get('buslinesId')?.reset()
      this.registerForm.get('busTerminalId')?.addValidators([Validators.required])
      this.registerForm.get('busTerminalId')?.updateValueAndValidity();
      this.registerForm.get('buslinesId')?.clearValidators();
      this.registerForm.get('buslinesId')?.updateValueAndValidity();
      this.registerForm.get('employeeShift')?.addValidators([Validators.required])
      this.registerForm.get('employeeShift')?.updateValueAndValidity();
      this.registerForm.get('buslinesId')?.disable()
      this.registerForm.get('busTerminalId')?.enable()
      this.registerForm.get('employeeShift')?.enable()
      this._changeDetectorRef.markForCheck();
    } else if (filteredRoles[0].userCategoryCode == "EMPLOYEE") {
      this.registerForm.get('busTerminalId')?.reset()
      this.registerForm.get('employeeShift')?.reset()
      this.registerForm.get('buslinesId')?.reset()
      this.registerForm.get('employeeShift')?.clearValidators();
      this.registerForm.get('employeeShift')?.updateValueAndValidity();
      this.registerForm.get('busTerminalId')?.clearValidators();
      this.registerForm.get('busTerminalId')?.updateValueAndValidity();
      this.registerForm.get('buslinesId')?.clearValidators();
      this.registerForm.get('buslinesId')?.updateValueAndValidity();
      this.registerForm.get('busTerminalId')?.disable()
      this.registerForm.get('buslinesId')?.disable()
      this.registerForm.get('employeeShift')?.disable()
      this._changeDetectorRef.markForCheck();
    } else if (filteredRoles[0].userCategoryCode == "BUSLINESMANAGEREMP") {
      this.registerForm.get('busTerminalId')?.reset()
      this.registerForm.get('employeeShift')?.reset()
      this.registerForm.get('buslinesId')?.reset()
      this.registerForm.get('busTerminalId')?.clearValidators();
      this.registerForm.get('busTerminalId')?.updateValueAndValidity();
      this.registerForm.get('buslinesId')?.addValidators([Validators.required])
      this.registerForm.get('buslinesId')?.updateValueAndValidity();
      this.registerForm.get('employeeShift')?.addValidators([Validators.required])
      this.registerForm.get('employeeShift')?.updateValueAndValidity();
      this.registerForm.get('busTerminalId')?.disable()
      this.registerForm.get('buslinesId')?.enable()
      this.registerForm.get('employeeShift')?.disable()

      this._changeDetectorRef.markForCheck();
    }
  }

  filterRolesByPlatform(roles: Role[], roleCode: string): Role[] {
    return roles.filter((role) => role.roleCode === roleCode);
  }

  switchUserType(data: string) {
    this.registerForm.get('userType')?.patchValue(data)
    if (data == "BUSLINESEMP") {
      this.registerForm.get('busTerminalId')?.reset()
      this.registerForm.get('employeeShift')?.reset()
      this.registerForm.get('buslinesId')?.reset()
      this.registerForm.get('busTerminalId')?.clearValidators();
      this.registerForm.get('busTerminalId')?.updateValueAndValidity();
      this.registerForm.get('buslinesId')?.addValidators([Validators.required])
      this.registerForm.get('buslinesId')?.updateValueAndValidity();
      this.registerForm.get('employeeShift')?.addValidators([Validators.required])
      this.registerForm.get('employeeShift')?.updateValueAndValidity();
      this.registerForm.get('busTerminalId')?.disable()
      this.registerForm.get('buslinesId')?.enable()
      this.registerForm.get('employeeShift')?.enable()

      this._changeDetectorRef.markForCheck();
    } else if (data == "BUSTERMINALEMP") {
      this.registerForm.get('busTerminalId')?.reset()
      this.registerForm.get('employeeShift')?.reset()
      this.registerForm.get('buslinesId')?.reset()
      this.registerForm.get('busTerminalId')?.addValidators([Validators.required])
      this.registerForm.get('busTerminalId')?.updateValueAndValidity();
      this.registerForm.get('buslinesId')?.clearValidators();
      this.registerForm.get('buslinesId')?.updateValueAndValidity();
      this.registerForm.get('employeeShift')?.addValidators([Validators.required])
      this.registerForm.get('employeeShift')?.updateValueAndValidity();
      this.registerForm.get('buslinesId')?.disable()
      this.registerForm.get('busTerminalId')?.enable()
      this.registerForm.get('employeeShift')?.enable()
      this._changeDetectorRef.markForCheck();
    } else if (data == "EMPLOYEE") {
      this.registerForm.get('busTerminalId')?.reset()
      this.registerForm.get('employeeShift')?.reset()
      this.registerForm.get('buslinesId')?.reset()
      this.registerForm.get('employeeShift')?.clearValidators();
      this.registerForm.get('employeeShift')?.updateValueAndValidity();
      this.registerForm.get('busTerminalId')?.clearValidators();
      this.registerForm.get('busTerminalId')?.updateValueAndValidity();
      this.registerForm.get('buslinesId')?.clearValidators();
      this.registerForm.get('buslinesId')?.updateValueAndValidity();
      this.registerForm.get('busTerminalId')?.disable()
      this.registerForm.get('buslinesId')?.disable()
      this.registerForm.get('employeeShift')?.disable()
      this._changeDetectorRef.markForCheck();
    } else if (data == "BUSLINESMANAGEREMP") {
      this.registerForm.get('busTerminalId')?.reset()
      this.registerForm.get('employeeShift')?.reset()
      this.registerForm.get('buslinesId')?.reset()
      this.registerForm.get('busTerminalId')?.clearValidators();
      this.registerForm.get('busTerminalId')?.updateValueAndValidity();
      this.registerForm.get('buslinesId')?.addValidators([Validators.required])
      this.registerForm.get('buslinesId')?.updateValueAndValidity();
      this.registerForm.get('employeeShift')?.addValidators([Validators.required])
      this.registerForm.get('employeeShift')?.updateValueAndValidity();
      this.registerForm.get('busTerminalId')?.disable()
      this.registerForm.get('buslinesId')?.enable()
      this.registerForm.get('employeeShift')?.disable()
      this._changeDetectorRef.markForCheck();
    }

  }

  getUser(): void {
    this._userService.getUserList().subscribe({
      next: (response: any) => {
        const data: any = response;
        this.dataUsers = data['data'];
        this._changeDetectorRef.markForCheck();
      },
      error: (err) => {
        // Handle error
      },
    });
  }

  switchPlatform(platform: string): void {
    // this.getRole(platform);
    this.registerForm.get('platform')?.setValue(platform)
    this._changeDetectorRef.markForCheck();
  }

  getDataInput(data: any): string {
    return data.target.value;
  }

  openSidebar(): void {
    this.createForm()
    this.registerForm.updateValueAndValidity();
    this.registerForm.clearValidators()
    this.registerForm.get('platform')?.enable()
    this.actionStatus = "save"
    this.addAsyncValidators()
    this.getRole('WEBSITE');
    this.getBusTerminal()
    this.getBusLines()
    this.sidebar = true;
  }

  openSidebarEdit(userList: UserList): void {
    this.createForm()
    this.clearUserValidators()
    this.updateValueAndValidity()
    this.switchUserType(userList.userType)
    this.getBusTerminal()
    this.getBusLines()
    this.actionStatus = "edit"
    this.getRole(userList.platform);
    this.sidebar = true;
    this.registerForm.patchValue(userList)
  }

  addAsyncValidators() {
    this.registerForm.get('password')?.addValidators([Validators.required])
    this.registerForm.get('confirmPassword')?.addValidators([Validators.required])
    this.registerForm.get('username')?.addValidators([Validators.required])
  }

  clearUserValidators() {
    this.registerForm.get('password')?.clearValidators();
    this.registerForm.get('confirmPassword')?.clearValidators();
    this.registerForm.get('username')?.clearValidators();
  }

  updateValueAndValidity() {
    this.registerForm.get('password')?.updateValueAndValidity();
    this.registerForm.get('username')?.updateValueAndValidity();
    this.registerForm.get('confirmPassword')?.updateValueAndValidity();
  }


  onCloseAction(): void {
    this.sidebar = false;
  }

  isFieldValid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!control?.invalid && (!!control?.touched || (!!control?.untouched && this.submittedForm$.value));
  }

  private handleInvalidForm(): void {
    this.submittedForm$.next(true);
    this._toastService.addSingle('warn', 'แจ้งเตือน', 'โปรดกรอกข้อมูลให้ครบถ้วน!');
  }

  private arePasswordsMatching(): boolean {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    return password === confirmPassword;
  }

  private showPasswordMismatchError(): void {
    this._toastService.addSingle('warn', 'แจ้งเตือน', 'รหัสผ่านไม่ตรงกัน!');
  }



  validateForm(): void {
    console.log(this.registerForm.value);
    this.registerForm.valueChanges.subscribe((val) => {
      console.log('_blue event:valueChanges', val)
    });
    if (this.registerForm.invalid) {
      this.handleInvalidForm();
      return;
    }
    if (!this.arePasswordsMatching()) {
      this.showPasswordMismatchError();
      return;
    }
    this.submittedForm$.next(false);
    this.save()
  }


  private save(): void {
    if (this.registerForm.valid && this.arePasswordsMatching()) {
      this._userService.save(this.registerForm.getRawValue(), this.actionStatus).subscribe({
        next: (response: any) => {
          const data: any = response;
          this.handleSaveSuccess();
        },
        error: (err) => {
          if (err.error.message == "DUPLICATE_USER") {
            this.handleSaveErrorDuplicateUser();
          }
        }
      });
    }
  }


  confirmDelete(userList: UserList) {
    this.confirmationService.confirm({
      header: 'ยืนยันการลบข้อมูลผู้ใช้งาน',
      message: `ต้องการลบข้อมูลผู้ใช้งาน ${userList.username} ใช่หรือไม่`,
      icon: 'pi pi-trash',
      accept: () => {
        this.delete(userList.username)
      },
      reject: () => {
      }
    });
  }

  private delete(username: string): void {
    this._userService.delete(username).subscribe({
      next: (response: any) => {
        const data: any = response;
        this.handleDeleteSuccess();
      },
      error: (err) => {
        this._toastService.addSingle('error', 'แจ้งเตือน', 'ไม่สามารถลบข้อมูลได้เนื่องจากข้อมูลถูกใช้งานอยู่!');
      }
    });
  }
  private handleDeleteSuccess(): void {
    this.onCloseAction();
    this.getUser();
    this._toastService.addSingle('success', 'แจ้งเตือน', 'ลบข้อมูลสำเร็จ');
  }


  private handleSaveSuccess(): void {
    this.onCloseAction();
    this.getUser();
    this._toastService.addSingle('success', 'แจ้งเตือน', 'บันทึกข้อมูลสำเร็จ');
  }

  private handleSaveErrorDuplicateUser(): void {
    this._toastService.addSingle('error', 'แจ้งเตือน', 'ผู้ใช้งานนี้มีในระบบแล้ว!');
  }
}