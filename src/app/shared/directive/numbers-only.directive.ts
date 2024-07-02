import { Directive, ElementRef, HostListener, Input, Renderer2, Output, EventEmitter } from '@angular/core';

@Directive({
    selector: '[appNumbersOnly]'
})
export class NumbersOnlyDirective {
    @Input() allowDecimal = false;
    @Output() validationError = new EventEmitter<boolean>();

    constructor(private el: ElementRef, private renderer: Renderer2) { }

    @HostListener('input', ['$event']) onInputChange(event: KeyboardEvent): void {
        const inputValue = this.el.nativeElement.value;
        const regexPattern = this.allowDecimal ? /^[0-9]*\.?[0-9]*$/ : /^[0-9]*$/;
        const isValid = regexPattern.test(inputValue);

        if (!isValid) {
            this.renderer.addClass(this.el.nativeElement, 'error');
        } else {
            this.renderer.removeClass(this.el.nativeElement, 'error');
        }
        console.log("dddd");

        this.validationError.emit(isValid);
    }
}
