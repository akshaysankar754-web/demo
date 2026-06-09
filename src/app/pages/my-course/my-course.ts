import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-my-course',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './my-course.html',
  styleUrls: ['./my-course.css']
})
export class MyCourseComponent implements OnInit {

  private api = inject(ApiService);

  courses: any[] = [];

  ngOnInit(): void {
    this.loadCourse();
  }

  loadCourse = () => {

    this.api.getMyCourse().subscribe({

      next: (res: any) => {

        console.log('MY COURSE', res);

        this.courses = Array.isArray(res) ? res : (res?.$values ?? res?.value ?? res?.data ?? []);

      },

      error: (err: any) => {

        console.log(err);

      }

    });

  }

  logout = () => {

    localStorage.clear();

    window.location.href = '/login';

  }

}