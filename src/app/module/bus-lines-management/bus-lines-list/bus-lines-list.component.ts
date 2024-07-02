import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { BusLines } from 'src/app/shared/interfaces/bus-lines.interface';
import { BusTerminal } from 'src/app/shared/interfaces/bus-terminal.interface';
import { PrimeNgModule } from 'src/app/shared/primeng.module';
import { ToastService } from 'src/app/shared/services/toast.service';
import { SharedAppModule } from 'src/app/shared/shared-app.module';
import { BusTerminalService } from '../../bus-terminal-management/service/bus-terminal.service';
import { BusLineService } from '../service/bus-line.service';

@Component({
  standalone: true,
  selector: 'app-bus-lines-list',
  imports: [PrimeNgModule, SharedAppModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './bus-lines-list.component.html'
})
export class BusLinesListComponent implements OnInit {
  private _service = inject(BusLineService);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _toastService = inject(ToastService);
  private _busTerminalService = inject(BusTerminalService);
  searchText!: string | null;
  dataTable: BusLines[] = [];
  dataDropdownBusTerminal: BusTerminal[] = [];
  submitted$ = new BehaviorSubject<boolean>(false);
  constructor(private fb: FormBuilder, private confirmationService: ConfirmationService, private messageService: MessageService) { }
  registerForm!: FormGroup;
  submittedForm: boolean[] = [];
  submittedFormCheck: boolean[] = [];
  sidebar: boolean = false;
  actionStatus: string = "save";
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

  getBusTerminal() {
    this._busTerminalService.search().subscribe({
      next: (response: any) => {
        const data: any = response;
        this.dataDropdownBusTerminal = data['data']
        this._changeDetectorRef.markForCheck()
      },
      error: (err) => {
      }
    });
  }

  findById(id: number) {
    this._service.findById({ busLinesId: id }).subscribe({
      next: (response: any) => {
        const data: any = response;
        const listDetails = data['data']['listDetail'] || [];
        this.registerForm.patchValue(data['data'])
        listDetails.forEach((detail: any) => {
          this.addInitialValue(detail);
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

  addInitialValue(initialValue: any) {
    const busTerminalId = initialValue ? initialValue.busTerminalId : null;
    const FareForm = this.fb.group({
      busTerminalId: new FormControl<number | null>(busTerminalId, Validators.required),
    });
    this.listDetail.push(FareForm);
  }

  openSidebar(): void {
    this.actionStatus = 'save'
    this.registerForm.reset()
    this.listDetail.reset()
    this.sidebar = true;
    this.submittedForm = [];
    this.submittedFormCheck = [];
    this.getBusTerminal()
    this.createForm()
    this.addBusTerminal()
  }

  openSidebarEdit(busLines: BusLines): void {
    this.getBusTerminal()
    this.actionStatus = 'edit'
    this.findById(busLines.busLinesId)
    this.registerForm.reset()
    this.listDetail.reset()
    this.sidebar = true;
    this.submittedForm = [];
    this.submittedFormCheck = [];
    this.createForm()
  }

  openSidebarDetail(busLines: BusLines): void {
    this.registerForm.reset()
    this.listDetail.reset()
    this.createForm()
    this.getBusTerminal()
    this.actionStatus = 'detail'
    this.findById(busLines.busLinesId)
    this.sidebar = true;
    this.submittedForm = [];
    this.submittedFormCheck = [];


  }

  onCloseAction(): void {
    this.sidebar = false;
  }

  createForm(): void {
    this.registerForm = this.fb.group({
      busLinesId: new FormControl<number | null>(null),
      busLinesNo: new FormControl<string | null>(null, Validators.required),
      busLinesOrigin: new FormControl<string | null>(null, Validators.required),
      busLinesDestination: new FormControl<number | null>(null, Validators.required),
      busLinesExpressway: new FormControl<number | null>(null, Validators.required),
      busLinesNightshift: new FormControl<boolean | null>(true, Validators.required),
      listDetail: this.fb.array([])
    });
  }

  setLinesNightshift(data: boolean) {
    this.registerForm.get('busLinesNightshift')?.patchValue(data)
  }

  get listDetail() {
    return this.registerForm.controls["listDetail"] as FormArray;
  }

  deleteSub(fareListIndex: number) {
    this.listDetail.removeAt(fareListIndex);
  }

  listDetailSub(): FormArray {
    return this.registerForm.get('listDetail') as FormArray;
  }

  addBusTerminal() {
    const FareForm = this.fb.group({
      busTerminalId: new FormControl<number | null>(null, Validators.required),
    });
    this.listDetail.push(FareForm);
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
    if (this.registerForm.invalid) {
      this.handleInvalidForm();
      return;
    }
    const allFalse = this.areAllFalse(this.submittedForm);
    if (this.registerForm.invalid && !allFalse) {
      this.handleInvalidForm();
    } else {
      this.submitted$.next(false);
      this.checkDuplicateFare()
    }
  }

  hasDuplicateTerminalId(): boolean {
    const terminalId = new Set<number>();
    for (const item of this.listDetail.value) {
      if (terminalId.has(item.busTerminalId)) {
        return true; // Duplicate found
      }
      terminalId.add(item.busTerminalId);
    }
    return false;
  }

  checkDuplicateFare() {
    if (this.hasDuplicateTerminalId()) {
      this._toastService.addSingle('warn', 'แจ้งเตือน', 'ไม่สามารถเลือกท่ารถเมล์ซ้ำกันได้!');
    } else {
      this.save()
    }

  }


  confirmDelete(busLines: BusLines) {
    this.confirmationService.confirm({
      header: 'ยืนยันการลบข้อมูลสายรถเมล์',
      message: `ต้องการลบข้อมูลสายรถเมล์ ${busLines.busLinesNo} ใช่หรือไม่`,
      icon: 'pi pi-trash',
      accept: () => {
        this.delete(busLines.busLinesId)
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

}
