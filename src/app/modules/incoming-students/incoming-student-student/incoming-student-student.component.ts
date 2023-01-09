import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PATHS } from '@core/constants';
import { IncomingStudent } from '@data/interfaces/incoming-student';
import { IncomingStudentsService } from '@data/services';

@Component({
  selector: 'app-incoming-student-student',
  templateUrl: './incoming-student-student.component.html',
  styleUrls: ['./incoming-student-student.component.css'],
})
export class IncomingStudentStudentComponent implements OnInit {
  loading = false;
  incomingStudent: IncomingStudent | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private incomingStudentsService: IncomingStudentsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(async (params) => {
      const _id = params['_id'];
      if (/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i.test(_id)) {
        await this.getIncomingStudent(_id);
      } else
        this.router.navigate([
          PATHS.ERROR.BASE_PATH,
          PATHS.ERROR.PAGE_NOT_FOUND,
        ]);
    });
  }

  async getIncomingStudent(_id: string): Promise<void> {
    this.loading = true;
    this.incomingStudent = await this.incomingStudentsService.get(_id);
    this.loading = false;
  }
}
