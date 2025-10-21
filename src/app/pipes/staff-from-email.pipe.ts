import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'staffFromEmail',
  standalone: false
})
export class StaffFromEmailPipe implements PipeTransform {

  transform(value: string,): string {
    return value ? value.split('@')[0] : '';
  }

}
