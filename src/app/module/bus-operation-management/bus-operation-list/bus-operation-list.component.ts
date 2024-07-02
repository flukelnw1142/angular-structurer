import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PrimeNgModule } from 'src/app/shared/primeng.module';

@Component({
  standalone: true,
  selector: 'app-bus-operation-list',
  imports: [PrimeNgModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<router-outlet></router-outlet>`,
})
export class BusOperationListComponent {

  getDataInput(data: any) {
    return data.target.value
  }

}
