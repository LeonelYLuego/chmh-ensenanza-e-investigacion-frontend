import { Injectable } from '@angular/core';

@Injectable()
/** Service to manage the Generations */
export class generationService {
  constructor() {}

  /**
   * Gets the inital year, last year and grade of generation. Sets in the value object the last year of the generation
   * @returns {{name: string, value: number}[]}
   */
  getGenerations(): { name: string; value: number }[] {
    const generations: { name: string; value: number }[] = [];
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
