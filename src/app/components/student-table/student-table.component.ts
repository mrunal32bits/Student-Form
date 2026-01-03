import { Component, EventEmitter, Input, Output, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Student } from '../../models/student.model';

@Component({
  selector: 'student-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatPaginatorModule],
  templateUrl: './student-table.component.html',
  styleUrls: ['./student-table.component.scss']
})
export class StudentTableComponent {
  @Input() students: Student[] = [];
  @Output() edit = new EventEmitter<{ student: Student; index: number }>();
  @Output() delete = new EventEmitter<number>();
  displayedColumns = ['name', 'age', 'gender', 'course', 'dob', 'skills', 'actions'];
  dataSource = new MatTableDataSource<Student>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['students']) {
      this.dataSource.data = this.students || [];
      // reset paginator to first page if data changed
      if (this.paginator) this.paginator.firstPage();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  private globalIndex(localIndex: number) {
    if (!this.paginator) return localIndex;
    return this.paginator.pageIndex * this.paginator.pageSize + localIndex;
  }

  requestEdit(i: number) {
    const idx = this.globalIndex(i);
    this.edit.emit({ student: this.students[idx], index: idx });
  }

  requestDelete(i: number) {
    const idx = this.globalIndex(i);
    this.delete.emit(idx);
  }
}
