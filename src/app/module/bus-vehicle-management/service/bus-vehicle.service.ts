import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BusVehicleService {
  private _http = inject(HttpClient);

  getBusVehicleList() {
    return this._http.get(environment.api_url + '/api/bus-vehicle/search');
  }
  save(req: any, url: string) {
    return this._http.post(environment.api_url + '/api/bus-vehicle/' + url, {
      ...req
    });
  }

  delete(id: any) {
    return this._http.get(environment.api_url + '/api/bus-vehicle/delete/' + id);
  }

}
