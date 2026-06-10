import { Injectable } from '@angular/core';
import { DataService } from './graph/data.service';

@Injectable({
  providedIn: 'root'
})
export class LogicService {

  constructor(private data_service: DataService) { }

  getAllTables(){
    return this.data_service.getAllNodes();
  }
}
