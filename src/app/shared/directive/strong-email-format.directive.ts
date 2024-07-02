import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
    selector: '[appStrongEmailFormat]',
    providers: [{ provide: NG_VALIDATORS, useExisting: StrongEmailFormatDirective, multi: true }]
})
export class StrongEmailFormatDirective implements Validator {
    @Input() appStrongEmailFormat: boolean = true; // You can set this to false to disable the validation

    validate(control: AbstractControl): ValidationErrors | null {
        if (!this.appStrongEmailFormat) {
            return null;
        }
        const value: string = control.value;
        if (!value) {
            return null;
        }
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(value)) {
            return { 'strongEmailFormat': true };
        }
        return null;
    }
}
