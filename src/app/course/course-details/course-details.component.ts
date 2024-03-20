import { Component, OnInit } from '@angular/core';
import { Courses } from '../courses.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesServerService } from '../courses-server.service';
import { Lecturer } from '../../lecturer.model';
import { LecturerServerService } from '../../lecturer-server.service';
import { Category } from '../../category.model';
import { CategoryServerService } from '../../category-server.service';

@Component({
  selector: 'app-course-details',
  standalone: false,
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.css'
})
export class CourseDetailsComponent implements OnInit {

  public course: Courses
  public courseId: number
  public lecturer: Lecturer
  public createdByUsername: string;
  public isLiked: boolean = false;
  public category: Category
  constructor(private router: Router, private route: ActivatedRoute, private _courseServise: CoursesServerService, private _lecturerService: LecturerServerService, private _categoryService: CategoryServerService) { }

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this.courseId = param['id'];
      console.log(this.courseId);
      this._courseServise.getCourseById(this.courseId).subscribe({
        next: (res) => {
          this.course = res;
          console.log(this.course);
          this.categories(); // קריאה לפונקציה categories() רק לאחר שהקורס מוגדר
        },
        error: (err) => {
          console.log(err)
        }
      });
    })
    //  this.lecturerId();
    this.categories();

    const lecturer = localStorage.getItem("lecturer");
    console.log(lecturer)
    if (lecturer) { this.DisplayEditCourse = true; }
  }

  public lecturerId() {
    const id = this.course.lecturerId;
    console.log(id, "id")

    this._lecturerService.getLecturerById(id).subscribe({
      next: (res) => {
        this.lecturer = res;
        console.log(this.lecturer);
      },
      error: (err) => {
        console.log(err)
      }
    });

  }
  public editCourse() {

    // const lecturer = localStorage.getItem("lecturer");
    let courserJson = JSON.stringify(this.course)
    const l1 = localStorage.setItem("course", courserJson)

    this.router.navigate(['/course/edit-course']);
  }

  DisplayEditCourse: boolean = false;
 
  toAllDetails() {
    // קוד הנדרש לנווט לדף הפרטים של הקורס
  }
  toggleLike() {
    if (!this.isLiked) {
      this.isLiked = true;
      setTimeout(() => {
        this.isLiked = false;
      }, 300); // 500 מילישניות = 0.5 שניות, זמן האנימציה
    }
  }
  public categories() {
    let c = this.course?.categoryId
    if (c !== undefined) {
      this._categoryService.getCategoryById(c).subscribe(res => {
        this.category = res;
        console.log(this.category);
      });
    }
  }

  isCourseStartedThisWeek(): boolean {
    // הפונקציה מחזירה true אם הקורס התחיל השבוע וfalse אחרת
    const courseStartDate = new Date(this.course.dateStart);
    const currentDate = new Date();

    // השוואת תאריך ההתחלה של הקורס לתאריך השבוע הנוכחי
    if (courseStartDate.getFullYear() === currentDate.getFullYear() &&
      courseStartDate.getMonth() === currentDate.getMonth() &&
      courseStartDate.getDate() >= currentDate.getDate() - currentDate.getDay() &&
      courseStartDate.getDate() <= currentDate.getDate() + (6 - currentDate.getDay())) {
      return true; // הקורס התחיל השבוע
    } else {
      return false; // הקורס לא התחיל השבוע
    }
  }

}

