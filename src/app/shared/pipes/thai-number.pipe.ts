import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'thaiNumber' })
export class ThaiNumberPipe implements PipeTransform {
  transform(value: number | string, decimalCount: number = 2): string {
    // Check if the value is not a valid number
    if (isNaN(Number(value))) {
      return 'Invalid Number';
    }

    // Convert the value to a number
    const numericValue = Number(value);

    // Format the number as Thai Baht
    const formattedValue = numericValue.toLocaleString('en-US', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: decimalCount,
      maximumFractionDigits: decimalCount,
    });

    // Remove trailing '.00' and add commas as thousand separators
    return formattedValue.replace(/\.00$/, '').replace(/^(\D+)/, (match, group1) => {
      // Remove non-digit characters from the beginning of the string
      return group1.replace(/\D/g, '');
    });
  }
}