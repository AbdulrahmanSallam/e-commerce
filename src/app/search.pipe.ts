import { Product } from './shared/interfaces/product';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform(Products: Product[], text: string): Product[] {
    return Products.filter((product) => {
      return product.title.toLowerCase().includes(text.toLowerCase());
    });
  }
}
