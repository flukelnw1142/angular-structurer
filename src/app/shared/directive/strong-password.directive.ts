import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
    selector: '[appStrongPassword]',
    providers: [{ provide: NG_VALIDATORS, useExisting: StrongPasswordDirective, multi: true }]
})
export class StrongPasswordDirective implements Validator {
    @Input() appStrongPassword: boolean = true; // You can set this to false to disable the validation

    validate(control: AbstractControl): ValidationErrors | null {
        if (!this.appStrongPassword) {
            return null;
        }
        const value: string = control.value;
        if (!value) {
            return null;
        }
        const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!regex.test(value)) {
            return { 'strongPassword': true };
        }
        return null;
    }
}
