import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BusLines } from 'src/app/shared/interfaces/bus-lines.interface';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { BusLineService } from '../bus-lines-management/service/bus-line.service';
import { DashboardService } from './dashboard.service';


export interface Dashboard {
  worksheetDate: any
  worksheetId: number
  worksheetTimeBegin: any
  worksheetTimeEnd: any
  worksheetHours: number
  worksheetHoursOt: number
  busLinesId: any
  busLinesNo: string
  busDivisionId: any
  busDivisionName: any
  busVehicleId: number
  busVehiclePlateNo: any
  busVehicleNumber: string
  worksheetDispatcher: any
  worksheetDriver: any
  worksheetFarecollect: any
  worksheetTerminalAgent: any
  worksheetBuslinesManager: any
  worksheetStatus: any
  worksheetSumTicket: number
  worksheetSumIncome: number
}

interface SearchCriteria {
  year?: number;
  busLinesNo?: string;
  busVehicleNumber?: string;
  worksheetId?: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private _busLineService = inject(BusLineService);
  private _dashboardService = inject(DashboardService);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _toastService = inject(ToastService);
  private fb = inject(FormBuilder);
  imageUrl = './assets/images/logo3.png';
  public now: Date = new Date();
  _authService = inject(AuthService)
  activeIndex: number = 0;
  lastTenYears: { title: string; value: string; }[] = [];
  scrollableTabs: any[] = Array.from({ length: 10 }, (_, i) => ({ title: "Title", content: "Content" }));
  searchForm!: FormGroup;


  constructor() {
    const currentYear = new Date().getFullYear() + 543;
    const current = new Date().getFullYear();
    for (let i = 0; i < 10; i++) {
      const yearThai = currentYear - i;
      const year = current - i;
      this.lastTenYears.push({ title: 'ปี ' + yearThai.toString(), value: year.toString() });
    }
    setInterval(() => {
      this.now = new Date();
    }, 1);
  }
  ngOnInit() {
    this.createFormSearch();
    this.getBusLine();
    this.getDashboard();

  }


  createFormSearch() {
    this.searchForm = this.fb.group({
      year: [null],
      busLinesNo: [null],
      busVehicleNumber: [null],
      worksheetId: [null],
    });
  }
  clearData() {
    this.createFormSearch()
    this.search()
    this.handleDeleteSuccess()
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


  dashboard: Dashboard[] = [];
  getDashboard() {
    this._dashboardService.getDashboard().subscribe({
      next: (response: any) => {
        const data: any = response;
        this.dashboard = data['data']
        this.search()
      },
      error: (err) => {

      }
    });
  }

  searchWorksheets(data: any[], criteria: SearchCriteria): any[] {
    const filteredWorksheets = data.filter((worksheet) => {
      const updateDate = new Date(worksheet.updateDate);

      // Check if the year matches
      if (criteria.year !== null && updateDate.getFullYear() !== Number(criteria.year)) {
        return false;
      }

      // Check if bus line number matches
      if (criteria.busLinesNo !== null && (!worksheet.busLinesNo || !worksheet.busLinesNo.toString().includes(criteria.busLinesNo!.toString()))) {
        return false;
      }

      // Check if vehicle number matches
      if (criteria.busVehicleNumber !== null && (!worksheet.busVehicleNumber || !worksheet.busVehicleNumber.toString().includes(criteria.busVehicleNumber!.toString()))) {
        return false;
      }

      // Check if worksheet ID matches
      if (criteria.worksheetId !== null && (!worksheet.worksheetId || !worksheet.worksheetId.toString().includes(criteria.worksheetId!.toString()))) {
        return false;
      }

      return true;
    });

    return filteredWorksheets;
  }


  dashboardSearch: Dashboard[] = [];
  search() {
    const searchCriteria = this.searchForm.value;
    const result = this.searchWorksheets(this.dashboard, searchCriteria);
    this.dashboardSearch = result;
    this._changeDetectorRef.markForCheck()
  }

  calculateTotal(column: string): number {
    return this.dashboardSearch.reduce((total, item: any) => total + (item[column] || 0), 0);
  }

  private handleDeleteSuccess(): void {
    this._toastService.addSingle('success', 'แจ้งเตือน', 'ล้างข้อมูลค้นหาสำเร็จ');
  }
}