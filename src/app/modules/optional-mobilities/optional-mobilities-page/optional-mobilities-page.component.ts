import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PATHS } from '@core/constants';
import { OptionalMobility } from '@data/interfaces';
import { OptionalMobilitiesService } from '@data/services';

@Component({
  selector: 'app-optional-mobilities-page',
  templateUrl: './optional-mobilities-page.component.html',
  styleUrls: ['./optional-mobilities-page.component.css'],
})
export class OptionalMobilitiesPageComponent implements OnInit {
  loading = false;
  paths = PATHS.OPTIONAL_MOBILITIES;
  interval: {
    initialMonths: { name: string; value: Date }[];
    finalMonths: { name: string; value: Date }[];
  } = { initialMonths: [], finalMonths: [] };
  intervalFormControl = new FormGroup({
    initialDate: new FormControl<Date | undefined>(undefined, [
      Validators.required,
    ]),
    finalDate: new FormControl<Date | undefined>(undefined, [
      Validators.required,
    ]),
  });
  optionalMobilities: OptionalMobility[] = [];

  constructor(private optionalMobilitiesService: OptionalMobilitiesService) {}

  async ngOnInit(): Promise<void> {
    this.interval = await this.optionalMobilitiesService.interval();
    if (
      this.interval.initialMonths.length > 0 &&
      this.interval.finalMonths.length > 0
    ) {
      this.intervalFormControl.controls.initialDate.setValue(
        this.interval.initialMonths[this.interval.initialMonths.length - 12]
          .value
      );
      this.intervalFormControl.controls.finalDate.setValue(
        this.interval.finalMonths[this.interval.finalMonths.length - 1].value
      );
      this.getOptionalMobilities();
    }
  }

  initialDateChanged(): void {
    if (
      this.intervalFormControl.controls.initialDate.value!.getTime() >
      this.intervalFormControl.controls.finalDate.value!.getTime()
    ) {
      const date = this.intervalFormControl.controls.initialDate.value!;
      const index = this.interval.finalMonths.findIndex((d) => {
        return (
          d.value.getTime() ==
          new Date(date.getFullYear(), date.getMonth() + 1, 0).getTime()
        );
      });
      this.intervalFormControl.controls.finalDate.setValue(
        this.interval.finalMonths[index].value
      );
    }
  }

  finalDateChanged(): void {
    if (
      this.intervalFormControl.controls.finalDate.value!.getTime() <
      this.intervalFormControl.controls.initialDate.value!.getTime()
    ) {
      const date = this.intervalFormControl.controls.finalDate.value!;
      const index = this.interval.initialMonths.findIndex((d) => {
        return (
          d.value.getTime() ==
          new Date(date.getFullYear(), date.getMonth(), 1).getTime()
        );
      });
      this.intervalFormControl.controls.initialDate.setValue(
        this.interval.initialMonths[index].value
      );
    }
  }

  async getOptionalMobilities(): Promise<void> {
    this.optionalMobilities = await this.optionalMobilitiesService.getAll();
    console.log(this.optionalMobilities);
  }
}
