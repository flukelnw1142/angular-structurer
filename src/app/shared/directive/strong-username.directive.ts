import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
    selector: '[appStrongUsername]',
    providers: [{ provide: NG_VALIDATORS, useExisting: StrongUsernameDirective, multi: true }]
})
export class StrongUsernameDirective implements Validator {
    @Input() appStrongUsername: boolean = true;

    validate(control: AbstractControl): ValidationErrors | null {
        if (!this.appStrongUsername) {
            return null;
        }
        const value: string = control.value;
        if (!value) {
            return null;
        }
        if (value.length <= 5) {
            return { 'strongUsername': true };
        }
        return null;
    }
}
