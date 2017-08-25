import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'TextCount',
    pure: false
})

export class TextCountPipe implements PipeTransform {
  transform(text: string, args: number) {
    // let maxLength = args || 160
    // let length = text.length;
    
    return text.length;
  }
}