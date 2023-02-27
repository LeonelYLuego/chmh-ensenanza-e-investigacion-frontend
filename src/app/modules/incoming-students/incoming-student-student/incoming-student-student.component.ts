import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { PATHS } from '@core/constants';
import { IncomingStudent } from '@data/interfaces/incoming-student';
import { IncomingStudentsService } from '@data/services';
import {
  IncomingStudentDocumentTypes,
  IncomingStudentDocumentTypesArray,
} from '@data/types/incoming-student-document.type';

/** Incoming Student Student component */
@Component({
  selector: 'app-incoming-student-student',
  templateUrl: './incoming-student-student.component.html',
  styleUrls: ['./incoming-student-student.component.css'],
})
export class IncomingStudentStudentComponent implements OnInit {
  loading = false;
  incomingStudent: IncomingStudent | null = null;
  documents: {
    title: string;
    name: IncomingStudentDocumentTypes;
    url: SafeResourceUrl | null;
  }[] = [];

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

  /** Gets a Incoming Student */
  async getIncomingStudent(_id: string): Promise<void> {
    this.loading = true;
    this.incomingStudent = await this.incomingStudentsService.get(_id);
    // Clear the documents array
    this.documents = [];
    if (this.incomingStudent) {
      // For each component
      for (let document of IncomingStudentDocumentTypesArray) {
        // Push the title, name and url
        this.documents.push({
          title: document.title,
          name: document.type,
          url: this.incomingStudent[document.type]
            ? await this.incomingStudentsService.getDocument(
                this.incomingStudent!._id!,
                document.type
              )
            : null,
        });
      }
    }
    this.loading = false;
  }

  /** Updates an Incoming Student file */
  async updateFile(
    event: any,
    type: IncomingStudentDocumentTypes
  ): Promise<void> {
    this.loading = true;
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      await this.incomingStudentsService.updateDocument(
        this.incomingStudent!._id!,
        type,
        formData
      );
      await this.getIncomingStudent(this.incomingStudent!._id!);
    }
  }

  /** Deletes an Incoming Student file */
  async deleteFile(type: IncomingStudentDocumentTypes): Promise<void> {
    this.loading = true;
    await this.incomingStudentsService.deleteDocument(
      this.incomingStudent!._id!,
      type
    );
    await this.getIncomingStudent(this.incomingStudent!._id!);
  }

  /** Toggle the VoBo attribute of the Incoming Student */
  async VoBoChanged(): Promise<void> {
    this.loading = true;
    await this.incomingStudentsService.VoBo(this.incomingStudent!._id!);
    await this.getIncomingStudent(this.incomingStudent!._id!);
  }

  /** Cancels an Incoming Student */
  async cancel(): Promise<void> {
    this.loading = true;
    await this.incomingStudentsService.cancel(this.incomingStudent!._id!);
    await this.getIncomingStudent(this.incomingStudent!._id!);
  }

  /** Uncancels an Incoming Student */
  async uncancel(): Promise<void> {
    this.loading = true;
    await this.incomingStudentsService.uncancel(this.incomingStudent!._id!);
    await this.getIncomingStudent(this.incomingStudent!._id!);
  }

  /** Deletes an Incoming Student */
  async deleteIncomingStudent(): Promise<void> {
    await this.incomingStudentsService.delete(this.incomingStudent!._id!);
    this.router.navigate([PATHS.INCOMING_STUDENTS.BASE_PATH]);
  }
}
