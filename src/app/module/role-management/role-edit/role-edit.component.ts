import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { MENU_WEB, MENU_MOBILE } from 'src/app/shared/constants/sidebar-menu.constant';
import { SidebarMenu } from 'src/app/shared/interfaces/sidebar-menu.interface';
import { UserCategory } from 'src/app/shared/interfaces/user-category.interface';
import { PrimeNgModule } from 'src/app/shared/primeng.module';
import { ToastService } from 'src/app/shared/services/toast.service';
import { SharedAppModule } from 'src/app/shared/shared-app.module';
import { RoleService } from '../service/role.service';

@Component({
  standalone: true,
  selector: 'app-role-edit',
  imports: [SharedAppModule, PrimeNgModule, FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
  template: `
<div style="margin: 20px;">
  <form [formGroup]="formGroup">
    <div class="formgrid grid mt-1">
      <div class="field col-6">
        <label>รหัส<span class="require">*</span></label>
        <div [ngStyle]="isFieldValid('roleCode') ? {border: '1px solid red', borderRadius: '7px'} : null">
          <input class="w-full" pInputText type="text" formControlName="roleCode" placeholder="กรุณากรอกข้อมูล" />
        </div>
      </div>
      <div class="field col-6">
        <label>ชื่อสิทธ์การใช้งาน<span class="require">*</span></label>
        <div [ngStyle]="isFieldValid('roleName') ? {border: '1px solid red', borderRadius: '7px'} : null">
          <input class="w-full" pInputText formControlName="roleName" type="text" placeholder="กรุณากรอกข้อมูล" />
        </div>
      </div>
         <div class="field col-6">
        <label>ประเภทผู้ใช้งาน</label>
        <p-dropdown  (onChange)="getCategoryData($event)"  [filter]="true" filterBy="userCategoryDesc" emptyFilterMessage="ไม่พบข้อมูล"
                                [options]="userCategory" formControlName="userCategoryCode" optionLabel="userCategoryDesc"
                                optionValue="userCategoryCode" placeholder="กรุณาเลือก..." [style]="{'minWidth':'100%'}"
                                appendTo="body"></p-dropdown>
      </div>
      <div class="field col-6">
        <label>รายละเอียด</label>
        <input class="w-full" pInputText formControlName="roleDescription" type="text" placeholder="กรุณากรอกข้อมูล" />
      </div>
    </div>
    <div class="formgrid grid mt-1">
      <div class="field col-6">
        <label>แพลตฟอร์มที่ต้องการสร้าง</label>
        <div class="flex flex-wrap gap-3">
          <div class="flex align-items-start">
            <p-radioButton  name="platform" value="WEBSITE" formControlName="platform" inputId="WEBSITE"></p-radioButton>
            <label for="WEBSITE" class="ml-2">เว็บแอปพลิเคชัน</label>
          </div>
          <div class="flex align-items-center">
            <p-radioButton  name="platform" value="APPLICATION" formControlName="platform" inputId="APPLICATION"></p-radioButton>
            <label for="APPLICATION" class="ml-2">โมบายแอปพลิเคชัน</label>
          </div>
        </div>
      </div>
    </div>
    <label>เลือกเมนูที่ต้องการแสดง</label>
    <div class="card" *ngIf="platformActive == 'WEBSITE'">
      <p-table [value]="menusWeb" [(selection)]="selectedMenuWeb" dataKey="code">
        <ng-template pTemplate="header">
          <tr>
            <th style="width: 4rem">
              <p-tableHeaderCheckbox></p-tableHeaderCheckbox>
            </th>
            <th>ชื่อเมนู</th>
            <th>รายละเอียด</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-menu>
          <tr>
            <td>
              <p-tableCheckbox [value]="menu"></p-tableCheckbox>
            </td>
            <td>{{menu.menu_th}}</td>
            <td>{{menu.menu_detail}}</td>
          </tr>
        </ng-template>
      </p-table>
    </div>
      <div class="card" *ngIf="platformActive == 'APPLICATION'">
      <p-table [value]="menusMobile" [(selection)]="selectedMenusMobile" dataKey="code">
        <ng-template pTemplate="header">
          <tr>
            <th style="width: 4rem">
              <p-tableHeaderCheckbox></p-tableHeaderCheckbox>
            </th>
            <th style="width:23%">ชื่อเมนู</th>
            <th>รายละเอียด</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-menu>
          <tr>
            <td>
              <p-tableCheckbox [value]="menu"></p-tableCheckbox>
            </td>
            <td>{{menu.menu_th}}</td>
            <td>{{menu.menu_detail}}</td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  </form>
</div>
    `,
})
export class RoleEditComponent implements OnInit {
  constructor(
    private _roleService: RoleService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _toastService: ToastService
  ) { }

  // Component properties
  private eventsSubscription!: Subscription;
  @Output() eventToParent = new EventEmitter<string>();
  private submitted$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  ingredient!: string;
  menusWeb: SidebarMenu[] = MENU_WEB;
  menusMobile: SidebarMenu[] = MENU_MOBILE;
  selectedMenuWeb: SidebarMenu[] = [];
  selectedMenusMobile: SidebarMenu[] = [];
  userCategory: UserCategory[] = [];
  platformActive: string = 'WEBSITE';
  // @Input() id!: number;
  @Input() events!: Observable<void>;

  @Input() set id(value: number | undefined) {
    if (value?.toString()) {
      this.findById(value)
    }
  }

  formGroup = new FormGroup({
    fwRoleId: new FormControl<number | null>(null),
    roleName: new FormControl<string | null>(null, Validators.required),
    userCategoryCode: new FormControl<string | null>(null, Validators.required),
    roleCode: new FormControl<string | null>(null, Validators.required),
    platform: new FormControl<string | null>('WEBSITE', Validators.required),
    roleDescription: new FormControl(''),
    menuList: new FormControl(''),
  });

  ngOnInit(): void {
    this.getCategory()
    this.eventsSubscription = this.events.subscribe(() => this.validateForm());
    this.formGroup.get('platform')?.disable()
  }
  findById(idReq: number) {
    this._roleService.findById(idReq).subscribe({
      next: (response: any) => {
        const data: any = response;
        const formData = data['data'];
        if (formData) {
          this.formGroup.patchValue(formData);
          this.formGroup.get('roleCode')?.disable()
          this.platformActive = this.formGroup.get('platform')?.value!;
          if (this.platformActive === 'WEBSITE') {
            const matchedMenuItems = this.menusWeb.filter(menuItem => formData.menuList.includes(menuItem.code));
            this.selectedMenuWeb = matchedMenuItems;

          } else {
            const matchedMenuItems = this.menusMobile.filter(menuItem => formData.menuList.includes(menuItem.code));
            this.selectedMenusMobile = matchedMenuItems;

          }
        }
        this._changeDetectorRef.markForCheck();
      },
      error: (err) => {
        // Handle error here
      }
    });
  }

  getCategory() {
    this._roleService.getUserCate().subscribe({
      next: (response: any) => {
        const data: any = response;
        this.userCategory = data['data']
        this._changeDetectorRef.markForCheck()
      },
      error: (err) => {

      }
    });
  }


  getCategoryData(data: any) {
    if ("EMPLOYEE" === data['value']) {
      this.switchPlatform('WEBSITE')
    } else {
      this.switchPlatform('APPLICATION')
    }
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
    this.formGroup.reset();
  }

  switchPlatform(p: string) {
    this.platformActive = p;
    this.formGroup.get('platform')?.setValue(p)
    this._changeDetectorRef.markForCheck();
  }

  isFieldValid(field: string) {
    const control = this.formGroup.get(field);
    return (!control?.valid && control?.touched) || (control?.untouched && this.submitted$.value);
  }

  validateForm() {
    if (this.formGroup.invalid) {
      this.eventToParent.emit("VALIDATE")
      this.showIncompleteDataWarning();
    } else {
      this.submitted$.next(false);
      this.validateSubMenu();
    }
  }

  validateSubMenu() {
    const selectedMenus = this.platformActive === 'WEBSITE' ? this.selectedMenuWeb : this.selectedMenusMobile;
    if (selectedMenus.length === 0) {
      this.eventToParent.emit("VALIDATE")
      this.showNoMenuSelectedWarning();
    } else {
      const codesString = this.getSelectedMenuCodesAsString(selectedMenus);
      this.formGroup.get('menuList')?.setValue(codesString);
      this.save();
    }
  }

  private showIncompleteDataWarning() {
    this._toastService.addSingle('warn', 'แจ้งเตือน', 'โปรดกรอกข้อมูลให้ครบถ้วน!');
    this.submitted$.next(true);
  }

  private showNoMenuSelectedWarning() {
    this._toastService.addSingle('warn', 'แจ้งเตือน', 'โปรดเลือกเมนูที่ต้องการแสดงอย่างน้อย 1 เมนู!');
  }

  private getSelectedMenuCodesAsString(selectedMenus: SidebarMenu[]) {
    const codes = selectedMenus.map(menu => menu.code);
    return codes.join(',');
  }

  save() {
    this._roleService.edit(this.formGroup.getRawValue()).subscribe({
      next: (response: any) => {
        const data: any = response;
        this.eventToParent.emit("SUCCESS")
        // Handle your response data
      },
      error: (err) => {
        this.eventToParent.emit("VALIDATE")
        if (err.error.message == "DUPICATE_ROLECODE") {
          this._toastService.addSingle('error', 'แจ้งเตือน', 'รหััสนี้มีในะบบแล้ว!');
        }
      }
    });
  }
}