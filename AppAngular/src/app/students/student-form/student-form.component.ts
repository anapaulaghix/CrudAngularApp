import { CommonModule, JsonPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { StudentsService } from '../../services/students.service';
import { ToastrService } from 'ngx-toastr';
import { response } from 'express';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, RouterLink, CommonModule],
  templateUrl: './student-form.component.html',
  styleUrl: './student-form.component.css'
})
export class StudentFormComponent implements OnInit, OnDestroy {

  form!:FormGroup;
  studentformSubscription!:Subscription;
  paramsSubscription!:Subscription;
  studentService = inject(StudentsService);

  isEdit=false;
  id=0;

  constructor(private fb:FormBuilder,
    private activatedRouter:ActivatedRoute,
    private router:Router,
    private toasterService:ToastrService
    ){
 }

 ngOnDestroy(): void {
  if(this.studentformSubscription){
    this.studentformSubscription.unsubscribe();
  }

  if(this.paramsSubscription){
    this.paramsSubscription.unsubscribe();
  }
}


  onSubmit() {
    if(!this.isEdit){
      this.adicionarEstudante()
     }else{
       this.editarEstudante()
     }
  }

  adicionarEstudante(): void{
    this.studentformSubscription= this.studentService.addStudent(this.form.value).subscribe({
      next:response=>{
        console.log(response)
        this.toasterService.success("Student sucesfully added")
        this.router.navigateByUrl('/students');
      },
      error:err=>{
        console.log(err);
        this.toasterService.error('Unable to add');
      }
    })
  }


  editarEstudante(): void {
    this.studentService.editStudent(this.id,this.form.value).subscribe(
      {
        next:()=>{
        this.toasterService.success("Edited sucessfully");
        this.router.navigateByUrl('/students')
      },
      error:err=>{
        this.toasterService.error('Unable to edit');
      }
    }
    )
  }


  ngOnInit(): void {
    this.paramsSubscription = this.activatedRouter.params.subscribe(
      {
        next:(response)=>{
          console.log(response['id']);
          let id = response['id'];
          this.id =id;
          if(!id) return;

          this.studentService.getStudent(id).subscribe({
            next:response=>{
              console.log(response);
              this.form.patchValue(response)
              this.isEdit = true;

            },
            error:err=>{
              console.log(err);

            }
          })

        },
        error:err=>{
          console.log(err);

        }
      }
    )

    this.form = this.fb.group({
        id:[this.id ?? 0],
        name:['',Validators.required],
        adress:[''],
        phoneNumber:[''],
        email:['',Validators.email]
    });
  }


}
