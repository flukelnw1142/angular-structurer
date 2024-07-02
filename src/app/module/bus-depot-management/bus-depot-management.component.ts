import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PrimeNgModule } from 'src/app/shared/primeng.module';

@Component({
  standalone: true,
  selector: 'app-bus-depot-management',
  imports: [PrimeNgModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<router-outlet></router-outlet>`,
})
export class BusDepotManagementComponent {

}
