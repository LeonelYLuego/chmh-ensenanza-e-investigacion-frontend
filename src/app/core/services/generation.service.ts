import { Injectable } from '@angular/core';

@Injectable()
export class generationService {
  constructor() {}

  getGenerations(): {name: string, value: number}[] {
    const generations: {name: string, value: number}[] = [];
    const today = new Date();
    let month = today.getMonth() + 1,
      year = today.getFullYear();

    if (month == 1 || month == 2) year -= 1;
    for (let i = 0; i < 5; i++) {
      let generation = year - i + ' - ' + (year - i + 3);
      if (i < 3) generation += ' (' + (i + 1) + ' año)';
      generations.push({
        name: generation,
        value: year - i + 3,
      });
    }
    return generations;
  }
}
