import { Component, Input } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';

@Component({
  selector: 'app-table',
  imports: [NgClass, NgFor],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
  @Input() current_table!: any;
}
