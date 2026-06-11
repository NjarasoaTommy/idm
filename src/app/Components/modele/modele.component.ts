import { Component } from '@angular/core';
import { LogicService } from '../../Services/logic.service';
import { NgFor } from '@angular/common';
import { TableComponent } from './table/table.component';
@Component({
  selector: 'app-modele',
  imports: [NgFor, TableComponent],
  templateUrl: './modele.component.html',
  styleUrl: './modele.component.scss'
})
export class ModeleComponent {
  all_tables!: any;

  constructor(private logic_service: LogicService){
    this.all_tables = this.logic_service.getAllTables();
  }
}
