import { PrimeNgModule } from './../../../shared/primeng.module';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Role } from 'src/app/shared/interfaces/role.interface';
import { BusVehicleService } from '../service/bus-vehicle.service';
import { BusVehicle } from 'src/app/shared/interfaces/bus-vehicle.interface';
import { SharedAppModule } from 'src/app/shared/shared-app.module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/shared/services/toast.service';
import { BusDepotService } from '../../bus-depot-management/service/bus-depot.service';
import { BehaviorSubject } from 'rxjs';
import { BusDepot } from 'src/app/shared/interfaces/bus-depot.interface';
import { PROVINCE_LIST } from 'src/app/shared/constants/province.constant';
import { Province } from 'src/app/shared/interfaces/province.interface';
import { BusTypeService } from '../../bus-type-management/service/bus-type.service';
import { BusType } from 'src/app/shared/interfaces/bus-type.interface';
import { BusLineService } from '../../bus-lines-management/service/bus-line.service';
import { BusLines } from 'src/app/shared/interfaces/bus-lines.interface';
import { BusDivisionService } from '../../bus-division-management/service/bus-division.service';
import { BusDivision } from 'src/app/shared/interfaces/bus-division.interface';
import { BUS_STATUS_LIST } from 'src/app/shared/constants/bus-status.constant';
import { BusStatus } from 'src/app/shared/interfaces/bus-status.interface';



@Component({
  standalone: true,
  selector: 'app-bus-vehicle-list',
  imports: [
    PrimeNgModule,
    SharedAppModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
  templateUrl: './bus-vehicle-list.component.html',
})
export class BusVehicleListComponent implements OnInit {
  private _service = inject(BusVehicleService);
  private _busTypeService = inject(BusTypeService);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _toastService = inject(ToastService);
  private _busLineService = inject(BusLineService);
  private _busDivisionService = inject(BusDivisionService);


  registerForm!: FormGroup;
  dataTable: BusVehicle[] = [];
  sidebar: boolean = false;
  provinceList: Province[] = PROVINCE_LIST;
  busStatusList: BusStatus[] = BUS_STATUS_LIST;
  actionStatus: string = "save";


  submittedForm$ = new BehaviorSubject<boolean>(false);
  constructor(private fb: FormBuilder, private confirmationService: ConfirmationService, private messageService: MessageService) { }


  ngOnInit() {
    this.search()
    this.createForm()
  }

  getDataInput(data: any) {
    return data.target.value
  }

  busTypeList: BusType[] = [];
  getBusType() {
    this._busTypeService.search().subscribe({
      next: (response: any) => {
        const data: any = response;
        this.busTypeList = data['data']
        this._changeDetectorRef.markForCheck()
      },
      error: (err) => {

      }
    });
  }
  busLinesList: BusLines[] = [];
  getBusLine() {
    this._busLineService.search().subscribe({
      next: (response: any) => {
        const data: any = response;
        this.busLinesList = data['data']
        this._changeDetectorRef.markForCheck()
      },
      error: (err) => {

      }
    });
  }
  busDivisionList: BusDivision[] = [];
  getDivisionLine() {
    this._busDivisionService.search().subscribe({
      next: (response: any) => {
        const data: any = response;
        this.busDivisionList = data['data']
        this._changeDetectorRef.markForCheck()
      },
      error: (err) => {

      }
    });
  }


  search() {
    this._service.getBusVehicleList().subscribe({
      next: (response: any) => {
        const data: any = response;
        this.dataTable = data['data']
        this._changeDetectorRef.markForCheck()
      },
      error: (err) => {

      }
    });
  }

  createForm(): void {
    this.registerForm = this.fb.group({
      busVehicleId: new FormControl<number | null>(null),
      busVehiclePlateNo: new FormControl<string | null>(null, Validators.required),
      busVehiclePlateProv: new FormControl<string | null>(null, Validators.required),
      busVehicleNumber: new FormControl<string | null>(null, Validators.required),
      busLinesId: new FormControl<number | null>(null, Validators.required),
      busTypeId: new FormControl<number | null>(null, Validators.required),
      busDivisionId: new FormControl<number | null>(null, Validators.required),
      busVehicleStatus: new FormControl<string | null>(null, Validators.required),
    })
  }

  openSidebar(): void {
    this.createForm()
    this.getBusLine()
    this.getBusType()
    this.getDivisionLine()
    this.sidebar = true;
    this.actionStatus = "save"
  }

  openSidebarEdit(busVehicle: BusVehicle): void {
    this.actionStatus = "edit"
    this.getBusLine()
    this.getBusType()
    this.getDivisionLine()
    this.registerForm.patchValue(busVehicle)
    this.sidebar = true;
  }

  onCloseAction(): void {
    this.sidebar = false;
  }


  busVehicleStatusCheck(status: string): string {
    if (status == "UNAVAILABLE") {
      return "อยู่ระหว่างดำเนินงาน"
    }
    return "พร้อมดำเนินงาน"
  }

  isFieldValid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!control?.invalid && (!!control?.touched || (!!control?.untouched && this.submittedForm$.value));
  }

  private handleInvalidForm(): void {
    this.submittedForm$.next(true);
    this._toastService.addSingle('warn', 'แจ้งเตือน', 'โปรดกรอกข้อมูลให้ครบถ้วน!');
  }

  validateForm(): void {
    if (this.registerForm.invalid) {
      this.handleInvalidForm();
      return;
    }

    this.submittedForm$.next(false);
    this.save()
  }

  save(): void {
    if (this.registerForm.valid) {
      this._service.save(this.registerForm.value, this.actionStatus).subscribe({
        next: (response: any) => {
          const data: any = response;
          this.handleSaveSuccess();
        },
        error: (err) => {

        }
      });
    }
  }

  confirmDelete(busVehicle: BusVehicle) {
    this.confirmationService.confirm({
      header: 'ยืนยันการลบข้อมูลรถเมล์',
      message: `ต้องการลบข้อมูลรถเมล์เลขทะเบียน ${busVehicle.busVehiclePlateNo} ใช่หรือไม่`,
      icon: 'pi pi-trash',
      accept: () => {
        this.delete(busVehicle.busVehicleId)
      },
      reject: () => {
      }
    });
  }

  private delete(id: number): void {
    this._service.delete(id).subscribe({
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
    this.search();
    this._toastService.addSingle('success', 'แจ้งเตือน', 'ลบข้อมูลสำเร็จ');
  }

  private handleSaveSuccess(): void {
    this.onCloseAction();
    this.search();
    this._toastService.addSingle('success', 'แจ้งเตือน', 'บันทึกข้อมูลสำเร็จ');
  }



}
