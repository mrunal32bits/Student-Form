import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Student } from '../../models/student.model';

@Component({
  selector: 'student-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss']
})
export class StudentFormComponent implements OnChanges {
  @Input() student?: Student | null = null;
  @Input() index: number | null = null;
  @Output() add = new EventEmitter<Student>();
  @Output() update = new EventEmitter<{ student: Student; index: number }>();

  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  skillsError: string | null = null;
  form: FormGroup;
  courses = ['B.Sc', 'B.A', 'B.Com', 'B.Tech', 'M.Sc', 'M.Tech'];
  subjectOptions = ['Math', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Computer'];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(250)]],
      age: [null, [Validators.required, Validators.min(1), Validators.max(100)]],
      gender: ['male', Validators.required],
      course: ['', Validators.required],
      subjects: [[]],
      email: ['', [Validators.email]],
      dob: ['', this.noFutureDate],
      skills: [[]]
    });
  }

  ngOnChanges() {
    if (this.student) {
      const patch = { ...this.student } as any;
      if (this.student.dob) patch.dob = new Date(this.student.dob);
      this.form.patchValue(patch);
      if (!this.form.get('subjects')?.value) this.form.get('subjects')?.setValue(this.student.subjects || []);
      if (!this.form.get('skills')?.value) this.form.get('skills')?.setValue(this.student.skills || []);
    } else {
      this.form.reset({ gender: 'male', subjects: [], skills: [] });
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.value as Student;
    if (this.index !== null && this.index !== undefined) {
      this.update.emit({ student: payload, index: this.index });
    } else {
      this.add.emit(payload);
    }
    this.form.reset({ gender: 'male', subjects: [], skills: [] });
  }

  resetForm() {
    this.form.reset({ gender: 'male', subjects: [], skills: [] });
  }

  addSkill(event: MatChipInputEvent) {
    const value = (event.value || '').trim();
    if (!value) { event.chipInput?.clear(); return; }
    if (value.length > 50) {
      this.skillsError = 'Each skill cannot exceed 50 characters';
      event.chipInput?.clear();
      return;
    }
    const arr = Array.isArray(this.form.value.skills) ? [...this.form.value.skills] : [];
    if (arr.length >= 25) {
      this.skillsError = 'Maximum 25 skills allowed';
      event.chipInput?.clear();
      return;
    }
    const totalChars = arr.reduce((acc: number, s: string) => acc + (s?.length || 0), 0) + value.length;
    if (totalChars > 500) {
      this.skillsError = 'Total skills length cannot exceed 500 characters';
      event.chipInput?.clear();
      return;
    }
    this.skillsError = null;
    arr.push(value);
    this.form.get('skills')?.setValue(arr);
    event.chipInput?.clear();
  }

  removeSkill(skill: string) {
    const arr = (this.form.value.skills || []).filter((s: string) => s !== skill);
    this.form.get('skills')?.setValue(arr);
    this.skillsError = null;
  }

  noFutureDate(control: AbstractControl): ValidationErrors | null {
    const v = control.value;
    if (!v) return null;
    const date = new Date(v);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date > today) return { futureDate: true };
    return null;
  }

  get skillsCount() {
    return (this.form.value.skills || []).length;
  }

  get skillsChars() {
    return (this.form.value.skills || []).reduce((acc: number, s: string) => acc + (s?.length || 0), 0);
  }

  toggleSubject(subject: string, checked: boolean) {
    const control = this.form.get('subjects');
    const arr = Array.isArray(control?.value) ? [...control!.value] : [];
    if (checked) {
      if (!arr.includes(subject)) arr.push(subject);
    } else {
      const idx = arr.indexOf(subject);
      if (idx > -1) arr.splice(idx, 1);
    }
    control?.setValue(arr);
  }

  onAgeInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input) return;
    const raw = input.value;
    if (raw === '') { this.form.get('age')?.setValue(null); return; }
    let val = parseInt(raw as any, 10);
    if (isNaN(val)) return;
    if (val > 100) {
      val = 100;
      input.value = String(val);
      this.form.get('age')?.setValue(val);
    }
    if (val < 1) {
      val = 1;
      input.value = String(val);
      this.form.get('age')?.setValue(val);
    }
  }
}
