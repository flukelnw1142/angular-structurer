import { ConfirmationService, MessageService } from 'primeng/api';
import { PrimeNgModule } from './../../../shared/primeng.module';
import { Component, inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { RoleService } from '../service/role.service';
import { Role } from 'src/app/shared/interfaces/role.interface';
import { RoleAddComponent } from '../role-add/role-add.component';
import { RoleEditComponent } from '../role-edit/role-edit.component';
import { SharedAppModule } from 'src/app/shared/shared-app.module';
import { Subject } from 'rxjs';
import { ToastService } from 'src/app/shared/services/toast.service';
@Component({
  standalone: true,
  selector: 'app-role-list',
  imports: [
    SharedAppModule,
    PrimeNgModule,
    RoleAddComponent,
    RoleEditComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService, MessageService],
  template: `
 <div class="mb-2">
  <p-accordion [activeIndex]="0">
    <p-accordionTab header="ค้นหารายการสิทธ์การใช้งาน">
       <div class="flex flex-wrap gap-3 mb-2">
        <div class="flex-auto">
            <label for="integer" class="font-bold block mb-2"> Code </label>
            <input  placeholder="กรอกคำค้นหา" (input)="datatableRole.filter(getDataInput($event),'roleCode' , 'contains')"  pInputText id="integer" class="w-full" />
        </div>
        <div class="flex-auto">
            <label for="number" class="font-bold block mb-2"> สิทธ์การใช้งาน </label>
            <input  placeholder="กรอกคำค้นหา" (input)="datatableRole.filter(getDataInput($event),'roleName' , 'contains')"  pInputText id="integer" class="w-full" pInputText class="w-full" />
        </div>
        <div class="flex-auto"></div>
        <div class="flex-auto"></div>
    </div>
    </p-accordionTab>
  </p-accordion>
 </div>
 <p-accordion [activeIndex]="0">
    <p-accordionTab header="รายการสิทธ์การใช้งาน">
      <div class="flex justify-content-between mb-3">
        <h2></h2>
        <p-button
        (click)="openSidebar('ADD',null!)"
          icon="pi pi-plus"
          label="เพิ่มสิทธ์การใช้งาน"
          styleClass="p-button-success p-button-sm"
        ></p-button>
      </div>
        <p-table
        #datatableRole
        [value]="dataRoles"
        [paginator]="true"
        [rows]="10"
        styleClass="p-datatable-gridlines"
        [showCurrentPageReport]="true"
        currentPageReportTemplate="แสดง {first} ถึง {last} จาก {totalRecords} ทั้งหมดรายการ"
        [rowsPerPageOptions]="[10, 25, 50]">
        <ng-template pTemplate="header">
            <tr>
                <th > Code</th>
                <th >สิทธ์การใช้งาน</th>
                 <th class="text-center">แพลตฟอร์ม</th>
                <th >รายละเอียด</th>
                <th class="text-center" >วันที่สร้าง</th>
                <th class="text-center" >จัดการ</th>
            </tr>
        </ng-template>
        <ng-template pTemplate="body" let-role>
            <tr>
                <td>{{ role.roleCode ?? '-'  }}</td>
                <td>{{ role.roleName ?? '-'  }}</td>
                 <td class="text-center"><span [class]="role.platform == 'WEBSITE' ? 'pi pi-desktop' :  'pi pi-mobile'"></span> {{ role.platform == 'WEBSITE' ? 'เว็บแอปพลิเคชัน' : 'โมบายแอปพลิเคชัน'  }}</td>
                <td >{{ role.roleDescription ?? '-'  }}</td>
                <td class="text-center">{{ role.createDate ?? '-'  }}</td>
                 <td class="text-center">
                  <p-button  (click)="openSidebar('EDIT',role.fwRoleId!)" icon="pi pi-file-edit"  styleClass="p-button-warning mr-2"></p-button>
                  <p-button (click)="confirmDelete(role.roleCode)" icon="pi pi-trash"  styleClass="p-button-danger"></p-button>
                 </td>
            </tr>
        </ng-template>
    </p-table>
    </p-accordionTab>
 </p-accordion>
  <p-dialog [draggable]="false" [header]="statusVisible == 'ADD' ? 'เพิ่มสิทธ์การใช้งาน' : 'แก้ไขสิทธ์การใช้งาน' " [(visible)]="sidebar" [modal]="true"  [style]="{ width: '50vw', height: '800px' }">  
      <app-role-add  (eventToParent)="onActionFromParent($event)"  [events]="eventsSubject.asObservable()"  *ngIf="statusVisible == 'ADD'"></app-role-add>
      <app-role-edit (eventToParent)="onActionFromParent($event)"  [events]="eventsSubject.asObservable()"  *ngIf="statusVisible == 'EDIT'" [id]="fwRoleId"></app-role-edit>
      <div class="text-center gap-3 mt-4">
       <p-button (click)="onCloseAction()" icon="pi  pi-times"  label="ยกเลิก" styleClass="p-button-secondary p-button-sm p-button-w mr-2"></p-button>
       <p-button (click)="emitEventToChild()" icon="pi pi-save" label="บันทึก" styleClass="p-button-success p-button-sm p-button-w"></p-button>
      </div>
  </p-dialog>
    <p-confirmDialog [style]="{ width: '27vw' }" acceptLabel="ยืนยัน" rejectLabel="ยกเลิก"  key="positionDialog" [position]="'top'" rejectButtonStyleClass="p-button-outlined"></p-confirmDialog>
`
})
export class RoleListComponent implements OnInit {
  private _roleService = inject(RoleService);
  private _toastService = inject(ToastService);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  dataRoles: Role[] = [];
  sidebar: boolean = false;
  statusVisible: string = 'ADD';
  fwRoleId!: number;
  isSubmit = new EventEmitter<void>();
  eventsSubject: Subject<void> = new Subject<void>();
  constructor(private confirmationService: ConfirmationService, private messageService: MessageService) { }

  ngOnInit() {
    this.getRole()
  }

  onActionFromParent(data: string) {
    if (data != "VALIDATE") {
      this.onCloseAction()
      setTimeout(() => {
        this.getRole()
      }, 100);
    }
  }

  emitEventToChild() {
    this.eventsSubject.next();
  }

  getRole() {
    this._roleService.getRoleList().subscribe({
      next: (response: any) => {
        const data: any = response;
        this.dataRoles = data['data']
        this._changeDetectorRef.markForCheck()
      },
      error: (err) => {

      }
    });
  }

  deleteRole(code: string) {
    this._roleService.delete(code).subscribe({
      next: (response: any) => {
        const data: any = response;
        this.dataRoles = data['data']
        this.getRole()
        this._toastService.addSingle('success', 'ลบข้อมูล', 'ลบข้อมูลสำเร็จ');
        this._changeDetectorRef.markForCheck()
      },
      error: (err) => {

      }
    });
  }

  getDataInput(data: any) {
    return data.target.value
  }

  openSidebar(status: string, id: number) {
    this.sidebar = true;
    this.statusVisible = status
    this.fwRoleId = id;
  }
  onCloseAction() {
    this.sidebar = false;
  }


  confirmDelete(code: string) {
    this.confirmationService.confirm({
      message: 'ยืนยันการลบข้อมูลใช่หรือไม่?',
      icon: 'pi pi-exclamation-triangle',
      header: 'การยืนยัน',
      key: 'positionDialog',
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
        this.deleteRole(code)
      },
      reject: () => {
      }
    });
  }


}
