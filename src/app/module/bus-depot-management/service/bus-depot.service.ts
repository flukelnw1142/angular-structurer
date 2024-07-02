import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BusDepotService {
  private _http = inject(HttpClient);

  search() {
    return this._http.get(environment.api_url + '/api/bus-depot/search');
  }
  save(req: any, url: string) {
    return this._http.post(environment.api_url + '/api/bus-depot/' + url, {
      ...req
    });
  }

  delete(id: any) {
    return this._http.get(environment.api_url + '/api/bus-depot/delete/' + id);
  }
}
