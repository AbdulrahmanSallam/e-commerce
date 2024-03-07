import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limitText',
})
export class LimitTextPipe implements PipeTransform {
  transform(text: string, limit: number): string {
    return text.split(' ').slice(0, limit).join(' ');
  }
}
