import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
@Pipe({
  name: 'orderBy',
})
export class SortPipe implements PipeTransform {
  transform(array, args, orden) {
    return _.orderBy(array, args, orden);
  }
}