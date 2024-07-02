import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { BusLines } from 'src/app/shared/interfaces/bus-lines.interface';
import { Fare } from 'src/app/shared/interfaces/fare.interface';
import { PrimeNgModule } from 'src/app/shared/primeng.module';
import { ToastService } from 'src/app/shared/services/toast.service';
import { SharedAppModule } from 'src/app/shared/shared-app.module';
import { FareService } from '../service/fare.service';

@Component({
  standalone: true,
  selector: 'app-fare-list',
  imports: [PrimeNgModule, SharedAppModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fare-list.component.html'
})

export class FareListComponent implements OnInit {


  private _service = inject(FareService);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _toastService = inject(ToastService);


  searchText!: string | null;
  dataTable: Fare[] = [];
  dataTable1?: Fare[];
  registerForm!: FormGroup;
  submittedForm$ = new BehaviorSubject<boolean>(false);
  sidebar: boolean = false;
  actionStatus: string = "save";


  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) {

  }

  ngOnInit() {
    this.search()
    this.createForm()
  }

  createForm(): void {
    this.registerForm = this.fb.group({
      fareId: new FormControl<number | null>(null),
      fareValue: new FormControl<number | null>(null, Validators.required),
      fareDesc: new FormControl<string | null>(null, Validators.required),
    });
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

  openSidebar(): void {
    this.createForm()
    this.sidebar = true;
  }

  onCloseAction(): void {
    this.sidebar = false;
  }

  openSidebarEdit(fare: Fare): void {
    this.actionStatus = "edit"
    this.sidebar = true;
    this.registerForm.patchValue(fare)
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


  confirmDelete(fare: Fare) {
    this.confirmationService.confirm({
      header: 'ยืนยันการลบข้อมูลราคาตั๋วรถเมล์',
      message: `ต้องการลบข้อมูลราคาตั๋วรถเมล์ ${fare.fareDesc} ใช่หรือไม่`,
      icon: 'pi pi-trash',
      accept: () => {
        this.delete(fare.fareId)
      },
      reject: () => {
      }
    });
  }

  delete(id: number): void {
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
