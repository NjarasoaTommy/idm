import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { generateGuid } from '@foblex/utils';

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

  initial_connection_list = ["1, N", "1, 1"];

  private node_list_subject = new BehaviorSubject<any>([]);
  private connection_list_subject = new BehaviorSubject<any>([]);

  // Observable which should be subscribed when other components want to be aware of update
  node_list$ = this.node_list_subject.asObservable();
  connection_list$ = this.connection_list_subject.asObservable();

  constructor(){
    this.initial_node_list.forEach((node: any) => {
      const relation_info:any = [node.node_relation_type];
      if(node.node_relation_type == "input"){
        relation_info[1] = node.node_input_connection_side;
      }
      else if(node.node_relation_type == "output"){
        relation_info[1] = node.node_output_connection_side;
      }
      else if(node.node_relation_type == "both"){
        relation_info[1] = node.node_input_connection_side;
        relation_info[2] = node.node_output_connection_side;
      }
      this.create_node_object(
        node.node_type,
        node.node_position,
        relation_info,
        node.node_title,
        node.node_attributes
      );
    });

    const all_initial_nodes = this.node_list_subject.getValue();
    for(let i = 0; i < this.initial_connection_list.length; i++){
      this.create_connection(
        all_initial_nodes[i].node_output_id,
        all_initial_nodes[i + 1].node_input_id,
        this.initial_connection_list[i])
    }
  }

  create_node_object(
    node_type: string,
    node_position: any,
    node_relation_type: any,
    node_title: string = "",
    node_attributes: any = []
  ){
    const all_nodes = this.node_list_subject.getValue();
    const new_id = generateGuid();
    all_nodes.push({
      node_id: new_id,
      node_title: node_title,
      node_type: node_type,
      node_attributes: node_attributes,
      node_position: node_position,
      node_input_connection_side: node_relation_type[0] == "input" ? node_relation_type[1] :
        node_relation_type[0] == "both" ? node_relation_type[1] : null,
      node_output_connection_side: node_relation_type[0] == "output" ? node_relation_type[1] :
        node_relation_type[0] == "both" ? node_relation_type[2] : null,
      node_relation_type: node_relation_type[0],
      node_input_id: node_relation_type[0] == "input" || node_relation_type[0] == "both" ? "input" + new_id : null,
      node_output_id: node_relation_type[0] == "output" || node_relation_type[0] == "both" ? "output" + new_id : null
    });
    this.node_list_subject.next(all_nodes);
  }

  create_connection(output_id: string, input_id: string, label: string){
    const all_connections = this.connection_list_subject.getValue();
    all_connections.push({
      connection_id: generateGuid(),
      connection_input_id: input_id,
      connection_output_id: output_id,
      connection_label: label
    });
    this.connection_list_subject.next(all_connections);
  }

  saveOneNode( // Used to update one node by its id.
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

  updateCardinality( // Used to update the cardinality of one connection by its id.
    connection_id: number,
    connection_cardinality: string
  ) {
    const all_connections = this.connection_list_subject.getValue(); // Get all connections.
    all_connections.forEach((current_connection: any) => {
      if(current_connection.connection_id == connection_id){ // Check the desired connection by it's ID
        current_connection.connection_id = connection_id;
        current_connection.connection_label = connection_cardinality;
      }
    });
    this.connection_list_subject.next(all_connections); // Emit the new list of connections
  }
}
