import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Student } from './models/student.model';
import { StudentFormComponent } from './components/student-form/student-form.component';
import { StudentTableComponent } from './components/student-table/student-table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, StudentFormComponent, StudentTableComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  showForm = true;
  students: Student[] = [];
  editingStudent: Student | null = null;
  editingIndex: number | null = null;

  onStudentAdded(student: Student) {
    this.students = [...this.students, student];
    // this.showForm = false;
  }

  onStudentUpdated(payload: { student: Student; index: number }) {
    this.students = this.students.map((s, i) => i === payload.index ? payload.student : s);
    // this.showForm = false;
    this.editingStudent = null;
    this.editingIndex = null;
  }

  onEditRequested(payload: { student: Student; index: number }) {
    this.editingStudent = payload.student;
    this.editingIndex = payload.index;
    this.showForm = true;
  }

  onDeleteRequested(index: number) {
    this.students = this.students.filter((_, i) => i !== index);
  }
}
