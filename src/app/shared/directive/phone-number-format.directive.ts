import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[formControlName][appPhoneNumberFormat]',
})
export class PhoneNumberFormatDirective {

    constructor(public ngControl: NgControl) { }

    @HostListener('ngModelChange', ['$event'])
    onModelChange(event: any) {
        this.onInputChange(event, false);
    }

    @HostListener('keydown.backspace', ['$event'])
    keydownBackspace(event: any) {
        this.onInputChange(event.target.value, true);
    }
    onInputChange(event: any, backspace: any) {
        let newVal = event.replace(/\D/g, '');
        if (backspace && newVal.length <= 10) {
            newVal = newVal.substring(0, newVal.length - 1);
        }
        if (newVal.length >= 10) {
            newVal = newVal.substring(0, 10); // Truncate to 10 characters
            newVal = newVal.replace(/^(\d{3})(\d{7})/, '$1-$2'); // Format as 000-0000000
        }
        if (this.ngControl && this.ngControl.valueAccessor) {
            this.ngControl.valueAccessor.writeValue(newVal);
        }
    }
}
