import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { generateGuid } from '@foblex/utils';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  initial_node_list = [
    {
      node_title: "Entité 1",
      node_type: "entity",
      node_attributes: [
        {
          name : "id1",
          type : 'number',
          is_identifier: true,
        },
        {
          name : "attr11",
          type : 'string',
          is_identifier: false,
        },
        {
          name : "attr12",
          type : 'boolean',
          is_identifier: false,
        }
      ],
      node_position: { x: 32, y: 32 }
    },
    {
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
      node_position: { x: 240, y: 32 }
    },
    {
      node_title: "Entité 2",
      node_type: "entity",
      node_attributes: [
        {
          name : "id2",
          type : 'number',
          is_identifier: true,
        },
        {
          name : "attr21",
          type : 'string',
          is_identifier: false,
        },
        {
          name : "attr22",
          type : 'boolean',
          is_identifier: false,
        }
      ],
      node_position: { x: 570, y: 32 }
    }
  ];

  initial_connection_list = ["1, N", "1, 1"];

  private node_list_subject = new BehaviorSubject<any>([]);
  private connection_list_subject = new BehaviorSubject<any>([]);

  // Observable which should be subscribed when other components want to be aware of update
  node_list$ = this.node_list_subject.asObservable();
  connection_list$ = this.connection_list_subject.asObservable();

  constructor(){
    // Create the initial nodes
    this.initial_node_list.forEach((node: any) => {
      this.create_node_object(
        node.node_type,
        node.node_position,
        node.node_title,
        node.node_attributes
      );
    });

    // Create initial connexions
    const all_initial_nodes = this.node_list_subject.getValue();
    for(let i = 0; i < this.initial_connection_list.length; i++){
      this.create_connection( // Supposes that each node is connected to the nearest node.
        // TOP : 1  -  RIGHT : 2  -  BOTTOM : 3  -  LEFT : 4
        all_initial_nodes[i].node_output_id + '2',
        all_initial_nodes[i + 1].node_input_id + '4',
        this.initial_connection_list[i])
    }
  }

  create_node_object( // Used to create a new node
    node_type: string,
    node_position: any,
    node_title: string = "",
    node_attributes: any = []
  ){
    const all_nodes = this.node_list_subject.getValue();
    const new_id = generateGuid();
    const new_node = {
      node_id: new_id,
      node_title: node_title,
      node_type: node_type,
      node_attributes: node_attributes,
      node_position: node_position,
      node_input_id: "input" + new_id,
      node_output_id: "output" + new_id
    };
    this.node_list_subject.next([...all_nodes, new_node]); // Update the list of nodes by adding the new one
  }

  create_connection(output_id: string, input_id: string, label: string){ // Used to add new connection object
    const all_connections = this.connection_list_subject.getValue();
    const new_connection = {
      connection_id: generateGuid(), // Generated identifier
      connection_input_id: input_id,
      connection_output_id: output_id,
      connection_label: label
    };
    this.connection_list_subject.next([...all_connections, new_connection]); // Update the list of connections by adding the new connection
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

  deleteOneNode(node_id: number) {
    // Used to remove one node by its id.
    const all_nodes = this.node_list_subject.getValue(); // Get all nodes.
    const new_all_nodes = all_nodes.filter((current_node: any) => {
      return current_node.node_id != node_id;
    });
    this.node_list_subject.next(new_all_nodes); // Emit the new list of nodes
    this.deleteConnectionsByNodeId(node_id); // Remove all related connections to the deleted node
  }

  deleteConnectionsByNodeId(node_id: number) {
    // Used to remove all connections for one node by this node's id.
    const all_connections = this.connection_list_subject.getValue(); // Get all connections.
    const new_all_connections = all_connections.filter((current_connection: any) => {
      return current_connection.connection_input_id.slice(5, -1) != node_id &&// 0:i - 1:n - 2:p - 3:u - 4:t ... ... [1|2|3|4]
        current_connection.connection_output_id.slice(6, -1) != node_id; // 0:o - 1:u - 2:t - 3:p - 4:u - 5:t ... ... [1|2|3|4]
    });
    this.connection_list_subject.next(new_all_connections); // Emit the new list of connections
  }

  deleteOneConnectionByItsId(connection_id: number) {
    // Used to remove one connection by its id.
    const all_connections = this.connection_list_subject.getValue(); // Get all connections.
    const new_all_connections = all_connections.filter((current_connection: any) => {
      return current_connection.connection_id != connection_id
    });
    this.connection_list_subject.next(new_all_connections); // Emit the new list of connections
  }

  // Get data directly (once without subscription)
  getAllNodes(){
    return this.node_list_subject.getValue();
  }
  getAllConnections(){
    return this.connection_list_subject.getValue();
  }
}
