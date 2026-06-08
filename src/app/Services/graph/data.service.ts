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
          name : "id1",
          type : 'number'
        },
        {
          name : "attr11",
          type : 'string'
        },
        {
          name : "attr12",
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
          name : "id",
          type : 'number'
        },
        {
          name : "Rel_attr1",
          type : 'string'
        },
        {
          name : "Rel_attr2",
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
          name : "id2",
          type : 'number'
        },
        {
          name : "attr21",
          type : 'string'
        },
        {
          name : "attr22",
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

  // Observable which should be subscribed when other components want to be aware of update
  node_list$ = this.node_list_subject.asObservable();
  connection_list$ = this.connection_list_subject.asObservable();

  saveOneNode( // Use to update one node by its id.
    node_id: number,
    node_type: string,
    node_title: string,
    node_attributes: any
  ) {
    const all_nodes = this.node_list_subject.getValue(); // Get all nodes.
    all_nodes.forEach((current_node: any) => {
      if(current_node.node_id == node_id){ // Check the desired node by it's ID
        current_node.node_id = node_id;
        current_node.node_type = node_type;
        current_node.node_title = node_title;
        current_node.node_attributes = node_attributes;
      }
    });
    this.node_list_subject.next(all_nodes); // Emit the new list of nodes
  }
}
