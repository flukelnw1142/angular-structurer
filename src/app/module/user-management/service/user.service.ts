import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserService {
  private _http = inject(HttpClient);

  getUserList() {
    return this._http.post(environment.api_url + '/api/user/get-user', {});
  }
  delete(username: any) {
    return this._http.get(environment.api_url + '/api/user/delete-user/' + username);
  }
  save(req: any, url: any) {
    url == "save" ? url = 'user/register' : url = 'employee/edit'
    return this._http.post(environment.api_url + '/api/' + url, {
      ...req
    });
  }


}
