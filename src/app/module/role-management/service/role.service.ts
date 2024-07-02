import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private _http = inject(HttpClient);

  getRoleList() {
    return this._http.get(environment.api_url + '/api/role/get-list');
  }

  getUserCate() {
    return this._http.get(environment.api_url + '/api/user-category/get-all');
  }


  findById(id: number) {
    return this._http.get(environment.api_url + `/api/role/find-by-id/${id}`);
  }

  save(req: any) {
    return this._http.post(environment.api_url + '/api/role/save', {
      ...req
    });
  }

  edit(req: any) {
    return this._http.post(environment.api_url + '/api/role/edit', {
      ...req
    });
  }

  delete(code: string) {
    return this._http.get(environment.api_url + `/api/role/delete-role/${code}`);
  }

}
