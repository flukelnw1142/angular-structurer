import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray, AbstractControl } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { BusType } from 'src/app/shared/interfaces/bus-type.interface';
import { Fare } from 'src/app/shared/interfaces/fare.interface';
import { PrimeNgModule } from 'src/app/shared/primeng.module';
import { ToastService } from 'src/app/shared/services/toast.service';
import { SharedAppModule } from 'src/app/shared/shared-app.module';
import { FareService } from '../../fare-management/service/fare.service';
import { BusTypeService } from '../service/bus-type.service';

@Component({
  standalone: true,
  selector: 'app-bus-type-list',
  imports: [PrimeNgModule, SharedAppModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './bus-type-list.component.html'
})
export class BusTypeListComponent implements OnInit {
  private _service = inject(BusTypeService);


  private _fareService = inject(FareService);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _toastService = inject(ToastService);
  registerForm!: FormGroup;
  searchText!: string | null;
  dataTable: BusType[] = [];
  sidebar: boolean = false;
  dataDropdownFare: Fare[] = [];
  submitted$ = new BehaviorSubject<boolean>(false);
  actionStatus: string = "save";
  constructor(private fb: FormBuilder, private confirmationService: ConfirmationService, private messageService: MessageService) { }

  submittedForm: boolean[] = [];
  submittedFormCheck: boolean[] = [];
  ngOnInit() {
    this.search()
    this.createForm()

  }
  search() {
    this._service.search().subscribe({
      next: (response: any) => {
        const data: any = response;
        this.dataTable = data['data']
        this._changeDetectorRef.markForCheck()
      },
      error: (err) => {

      }
    });


  }


  getDataInput(data: any) {
    return data.target.value
  }

  getFare() {
    this._fareService.search().subscribe({
      next: (response: any) => {
        const data: any = response;
        this.dataDropdownFare = data['data']
        this._changeDetectorRef.markForCheck()
      },
      error: (err) => {

      }
    });
  }


  findById(id: number) {
    this._service.findById({ busTypeId: id }).subscribe({
      next: (response: any) => {
        const data: any = response;
        const listDetails = data['data']['listDetail'] || [];
        this.registerForm.patchValue(data['data'])
        listDetails.forEach((detail: any) => {
          this.addFareWithInitialValue(detail);
        });
        if (this.actionStatus == 'detail') {
          this.registerForm.disable()
          this.listDetail.controls.forEach(control => {
            control.disable();
          });
        }

      },
      error: (err) => {
        // Handle error
      }
    });
  }

  addFareWithInitialValue(initialValue: any) {
    const fareId = initialValue ? initialValue.fareId : null;
    const FareForm = this.fb.group({
      fareId: new FormControl<number | null>(fareId, Validators.required),
    });
    this.listDetail.push(FareForm);
  }

  addFare() {
    const FareForm = this.fb.group({
      fareId: new FormControl<number | null>(null, Validators.required),
    });
    this.listDetail.push(FareForm);
  }



  openSidebar(): void {
    this.registerForm.reset()
    this.listDetail.reset()
    this.sidebar = true;
    this.submittedForm = [];
    this.submittedFormCheck = [];
    this.actionStatus = 'save'
    this.getFare()
    this.createForm()
    this.addFare()
  }

  openSidebarEdit(busType: BusType): void {
    this.actionStatus = 'edit'
    this.findById(busType.busTypeId)
    this.registerForm.reset()
    this.listDetail.reset()
    this.sidebar = true;
    this.submittedForm = [];
    this.submittedFormCheck = [];
    this.getFare()
    this.createForm()
  }

  openSidebarDetail(busType: BusType): void {
    this.createForm()
    this.listDetail.reset()
    this.actionStatus = 'detail'
    this.findById(busType.busTypeId)
    this.registerForm.reset()
    this.sidebar = true;
    this.submittedForm = [];
    this.submittedFormCheck = [];
    this.getFare()

  }


  onCloseAction(): void {
    this.sidebar = false;
  }

  createForm(): void {
    this.registerForm = this.fb.group({
      busTypeId: new FormControl<number | null>(null),
      busTypeName: new FormControl<number | null>(null, Validators.required),
      listDetail: this.fb.array([])
    });

  }

  get listDetail() {
    return this.registerForm.controls["listDetail"] as FormArray;
  }

  listDetailSub(): FormArray {
    return this.registerForm.get('listDetail') as FormArray;
  }

  deleteFare(fareListIndex: number) {
    this.listDetail.removeAt(fareListIndex);
  }



  isFieldValid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!control?.invalid && (!!control?.touched || (!!control?.untouched && this.submitted$.value));
  }

  private handleInvalidForm(): void {
    this.submitted$.next(true);
    this._toastService.addSingle('warn', 'แจ้งเตือน', 'โปรดกรอกข้อมูลให้ครบถ้วน!');
  }

  isFieldValidSub(field: string, index: number) {
    const control = this.getFromListControl(index, field);
    return (
      (control?.invalid && control?.touched) ||
      (control?.invalid && control?.untouched && this.submittedForm[index])
    );
  }

  getFromListControl(
    index: number,
    controlName: string
  ): AbstractControl | null {
    const form = this.registerForm.get('listDetail') as FormArray;
    this.submittedFormCheck[index] = form.controls[index].invalid;
    if (form.controls[index]) {
      return form.controls[index].get(controlName);
    }
    return null;
  }

  areAllFalse(arr: boolean[]): boolean {
    return arr.every((value) => !value);
  }

  validateForm(): void {
    const listFormArray = this.registerForm.get('listDetail') as FormArray;
    let index = 0;
    for (const control of listFormArray.controls) {
      if (control.invalid) {
        this.submittedForm[index] = true;
      } else {
        this.submittedForm[index] = false;
      }
      index = index + 1;
    }
    const allFalse = this.areAllFalse(this.submittedForm);
    if (this.registerForm.invalid && !allFalse) {
      this.handleInvalidForm();
    } else {
      this.submitted$.next(false);
      this.checkDuplicateFare()
    }
  }

  hasDuplicateFareIds(): boolean {
    const fareIds = new Set<number>();
    for (const item of this.listDetail.value) {
      if (fareIds.has(item.fareId)) {
        return true; // Duplicate found
      }
      fareIds.add(item.fareId);
    }
    return false;
  }

  checkDuplicateFare() {
    if (this.hasDuplicateFareIds()) {
      this._toastService.addSingle('warn', 'แจ้งเตือน', 'ไม่สามารถเลือกราคาตั๋วรถซ้ำกันได้!');
    } else {
      this.save()
    }

  }



  confirmDelete(busType: BusType) {
    this.confirmationService.confirm({
      header: 'ยืนยันการลบข้อมูลประเภทรถเมล์',
      message: `ต้องการลบข้อมูลประเภทรถเมล์ ${busType.busTypeName} ใช่หรือไม่`,
      icon: 'pi pi-trash',
      accept: () => {
        this.delete(busType.busTypeId)
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

  private save(): void {
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


}