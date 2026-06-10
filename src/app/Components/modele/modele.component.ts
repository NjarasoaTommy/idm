import { Component } from '@angular/core';
import { LogicService } from '../../Services/logic.service';

@Component({
  selector: 'app-modele',
  imports: [],
  templateUrl: './modele.component.html',
  styleUrl: './modele.component.scss'
})
export class ModeleComponent {
  all_tables!: any;

  constructor(private logic_service: LogicService){
    this.all_tables = this.logic_service.getAllTables();
    console.log('----------------------');
    console.log(this.all_tables);
    console.log('----------------------');
  }
}
