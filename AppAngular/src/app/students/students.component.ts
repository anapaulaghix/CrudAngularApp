import { Observable } from 'rxjs';
import { StudentsService } from './../services/students.service';
import { Component, OnInit, inject } from '@angular/core';
import { Student } from '../types/student';
import { ToastrService } from 'ngx-toastr';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [AsyncPipe, CommonModule, RouterLink],
  templateUrl: './students.component.html',
  styleUrl: './students.component.css'
})
export class StudentsComponent implements OnInit{

    students$!: Observable<Student[]>
    studentService = inject(StudentsService);

    toasterService= inject(ToastrService)
  router: any;

    ngOnInit(): void {
      this.getStudents();

    }

    delete(id: number) {
      this.studentService.deleteStudent(id).subscribe({
        next: (response) => {
          this.getStudents();
          this.toasterService.success("Sucessfully Deleted");
        },
        error: err => {
          console.log(err);
          this.toasterService.error("Unable to delete")
        }
      })
    }

    private getStudents(): void {
      this.students$ = this.studentService.getStudents()
    }


}
