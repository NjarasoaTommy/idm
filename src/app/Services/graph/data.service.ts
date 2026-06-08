import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  initial_node_list = [
    {
      node_id: 1,
      node_title: "Entité 1",
      node_type: "entity",
      node_attributes: [
        {
          label : "id1",
          type : 'number'
        },
        {
          label : "attr11",
          type : 'string'
        },
        {
          label : "attr12",
          type : 'boolean'
        }
      ],
      node_position: { x: 32, y: 32 },
      node_output_connection_side: "right",
      node_relation_type: "output",
      node_output_id: "output1"
    },
    {
      node_id: 2,
      node_title: "Relation",
      node_type: "relation",
      node_attributes: [
        {
          label : "id",
          type : 'number'
        },
        {
          label : "Rel_attr1",
          type : 'string'
        },
        {
          label : "Rel_attr2",
          type : 'boolean'
        }
      ],
      node_position: { x: 240, y: 32 },
      node_input_connection_side: "left",
      node_output_connection_side: "right",
      node_relation_type: "both",
      node_input_id: "input1",
      node_output_id: "output2"
    },
    {
      node_id: 3,
      node_title: "Entité 2",
      node_type: "entity",
      node_attributes: [
        {
          label : "id2",
          type : 'number'
        },
        {
          label : "attr21",
          type : 'string'
        },
        {
          label : "attr22",
          type : 'boolean'
        }
      ],
      node_position: { x: 570, y: 32 },
      node_input_connection_side: "left",
      node_relation_type: "input",
      node_input_id: "input2"
    }
  ];

  initial_connection_list = [
    {
      connection_input_id: "input1",
      connection_output_id: "output1",
      connection_label: "1,N",
    },
    {
      connection_input_id: "input2",
      connection_output_id: "output2",
      connection_label: "1,1",
    }
  ];

  private node_list_subject = new BehaviorSubject<any>(this.initial_node_list);
  private connection_list_subject = new BehaviorSubject<any>(this.initial_connection_list);

  node_list$ = this.node_list_subject.asObservable();
  connection_list$ = this.connection_list_subject.asObservable();

  constructor() { }
}
