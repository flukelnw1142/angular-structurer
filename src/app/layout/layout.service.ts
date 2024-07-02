import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

export enum LayoutType { 'NO_AUTH' = 'NO_AUTH', 'AUTH' = 'AUTH' };

@Injectable({ providedIn: 'root' })
export class LayoutService {
  layout$ = new BehaviorSubject<LayoutType>(LayoutType.NO_AUTH);
}
