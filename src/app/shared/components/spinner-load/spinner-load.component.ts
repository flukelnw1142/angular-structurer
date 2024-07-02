import { ChangeDetectorRef, Component } from '@angular/core';
import { SpinnerHandlerService } from '../../interceptor/spinner-handler.service';

@Component({
  selector: 'app-spinner-load',
  templateUrl: './spinner-load.component.html',
  styleUrls: ['./spinner-load.component.scss']
})
export class SpinnerLoadComponent {
  spinnerActive: boolean = true;
  constructor(
    public spinnerHandler: SpinnerHandlerService,
    private _cdr: ChangeDetectorRef
  ) {
    this.spinnerHandler.showSpinner.subscribe(this.showSpinner.bind(this));
  }
  showSpinner = (state: boolean): void => {
    this.spinnerActive = state;
    this._cdr.markForCheck();
  };

}
