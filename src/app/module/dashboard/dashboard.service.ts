
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private _http = inject(HttpClient);

  getDashboard() {
    return this._http.get(environment.api_url + '/api/worksheet/get-list-dashboard');
  }


}
