import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'money',
})
export class MoneyPipe implements PipeTransform {
    transform(value: number | string | undefined | null): string {
        if (!value) {
            return '0.00';
        }

        const val = value ? `${value}`.split('.') : ['0', '00'];

        const whole = new CurrencyPipe('en').transform(
            Number(val[0].replace(',', '')),
            'USD',
            '',
            '1.0-0'
        ) as string;

        const decimals = val[1] ? `${val[1]}00`.slice(0, 2) : '00';

        return `${whole}.${decimals}`;
    }
}
