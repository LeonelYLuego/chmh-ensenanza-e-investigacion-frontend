import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialService } from '@app/data/interfaces/social-service';
import { SocialServicesService } from '@app/data/services/social-services.service';

@Component({
  selector: 'app-social-service-student',
  templateUrl: './social-service-student.component.html',
  styleUrls: ['./social-service-student.component.css'],
})
export class SocialServiceStudentComponent implements OnInit {
  socialService: SocialService | null = null;
  loading = true;

  constructor(
    private socialServicesService: SocialServicesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(async (params) => {
      const _id = params['_id'];
      if (/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i.test(_id)) {
        this.socialService = await this.socialServicesService.getSocialService(
          _id
        );
        if (this.socialService) {
          this.loading = false;
          return;
        }
      }
      this.router.navigate(['/404']);
    });
  }
}
