import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NameValueInterface } from '@app/core/interfaces/name-value.interface';
import { SocialServicesService } from '@app/data/services/social-services.service';

@Component({
  selector: 'app-social-services-page',
  templateUrl: './social-services-page.component.html',
  styleUrls: ['./social-services-page.component.css'],
})
export class SocialServicesPageComponent implements OnInit {
  periods: NameValueInterface<{ year: number; period: number }>[] = [];
  periodFormControl = new FormGroup({
    initialPeriod: new FormControl<{
      year: number;
      period: number;
    } | null>(null),
    finalPeriod: new FormControl<{
      year: number;
      period: number;
    } | null>(null),
  });

  constructor(private socialServicesService: SocialServicesService) {}

  async ngOnInit(): Promise<void> {
    this.periods = await this.socialServicesService.getPeriods();
    if (this.periods.length >= 3) {
      this.periodFormControl.controls.initialPeriod.setValue(
        this.periods[0].value
      );
      this.periodFormControl.controls.finalPeriod.setValue(
        this.periods[2].value
      );
    }
  }

  private validatePeriod(): boolean {
    const value = this.periodFormControl.value;
    const initial = value.initialPeriod!;
    const final = value.finalPeriod!;
    return (
      final.year < initial.year ||
      (final.year == initial.year && final.period < initial.period)
    );
  }

  initialPeriodChange() {
    if (this.validatePeriod()) {
      this.periodFormControl.controls.finalPeriod.setValue(
        this.periodFormControl.value.initialPeriod!
      );
    }
  }

  finalPeriodChange() {
    if (this.validatePeriod()) {
      this.periodFormControl.controls.initialPeriod.setValue(
        this.periodFormControl.value.finalPeriod!
      );
    }
  }
}
