import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BusLineService {
  private _http = inject(HttpClient);

  search() {
    return this._http.get(environment.api_url + '/api/bus-lines/search-all');
  }
  save(req: any, utl: string) {
    return this._http.post(environment.api_url + '/api/bus-lines/' + utl, {
      ...req
    });
  }

  delete(id: any) {
    return this._http.get(environment.api_url + '/api/bus-lines/delete/' + id);
  }


  findById(req: any) {
    return this._http.post(environment.api_url + '/api/bus-lines/find-by-id', {
      ...req
    });
  }

}
