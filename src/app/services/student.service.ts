import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Student } from '../models/student.model';

const STORAGE_KEY = 'students_v1';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private _students$ = new BehaviorSubject<Student[]>(this.load());
  readonly students$ = this._students$.asObservable();

  private load(): Student[] {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as Student[]; } catch { return []; }
  }

  private save(list: Student[]) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch { /* ignore */ }
    this._students$.next(list);
  }

  get value() { return this._students$.value; }

  add(student: Student) {
    const next = [...this._students$.value, student];
    this.save(next);
  }

  update(index: number, student: Student) {
    const next = [...this._students$.value];
    next[index] = student;
    this.save(next);
  }

  remove(index: number) {
    const next = this._students$.value.filter((_, i) => i !== index);
    this.save(next);
  }

  clear() {
    this.save([]);
  }
}
