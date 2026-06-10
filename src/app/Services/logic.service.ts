import { Injectable } from '@angular/core';
import { DataService } from './graph/data.service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogicService {
  all_nodes!: any;
  all_connections!: any;

  all_nodes_subscription!: Subscription;
  all_connections_subscription!: Subscription;

  all_entities!: any;
  all_relations: any;

  relation_entities: any = []; // Store the correspondance of relation and their entities
  all_tables: any = []; // List of all tables(MLD)

  constructor(private data_service: DataService) {
    this.all_nodes_subscription = this.data_service.node_list$.subscribe((all_nodes: any) => {
      this.all_nodes = all_nodes;
    });
    this.all_connections_subscription = this.data_service.connection_list$.subscribe((all_connections: any) => {
      this.all_connections = all_connections;
    });
  }

  updateAllEntitiesList(){
    this.all_entities = this.all_nodes.filter((node: any) => {
      return node.node_type == "entity";
    });
  }
  updateAllRelationsList(){
    this.all_relations = this.all_nodes.filter((node: any) => {
      return node.node_type == "relation";
    });
  }

  getAllTables(){
    this.updateAllEntitiesList();
    this.updateAllRelationsList();
    this.all_relations.forEach((relation: any) => {
      // Get the list of entities connected to the current relation.
      const all_connected_entities = this.getConnectedEntities(relation.node_id);
      this.relation_entities.push([relation, all_connected_entities]) // [current_relation + all conneted_entities(+cardinality)]
    });

    console.log("---------------------------------------");
    console.log(this.relation_entities);
    console.log("---------------------------------------");

    this.relation_entities.forEach((rel_ent: any) => {
      this.fillListOfTable(rel_ent); // Create the table depends on the relation and the entities.
    });

    return this.all_tables;
  }

  getConnectedEntities(relation_id: string){ // ENTITY - RELATION
    // Returns the list of entities connected to the relation with its cardinality
    const related_connections = this.getConnectionsByRelationId(relation_id);
    const connected_entities: any = [];
    related_connections.forEach((connection: any) => {
      const entity_connected_to_current_connection = this.getEntityByConnection(connection);

      // [connection_id, entity_data(full)]
      connected_entities.push([connection.connection_label, entity_connected_to_current_connection])
    });
    return connected_entities;
  }

  getConnectionsByRelationId(relation_id: string){ // CONNECTION - RELATION(ID)
    // Returns all connections that are connected to the current relation
    const connections = this.all_connections.filter((connection: any) => {
      return connection.connection_input_id.slice(5, -1) == relation_id || // 0:i - 1:n - 2:p - 3:u - 4:t ... ... [1|2|3|4]
        connection.connection_output_id.slice(6, -1) == relation_id; // 0:o - 1:u - 2:t - 3:p - 4:u - 5:t ... ... [1|2|3|4]
    });
    return connections;
  }

  getEntityByConnection(connection: any){ // ENTITE - CONNECTION
    // Returns all entities that are connected to the current connection
    const entity = this.all_entities.filter((entity: any) => { // Filter only inside entity(Make sure that we will get only 1 entity)
      return connection.connection_input_id.slice(5, -1) == entity.node_id || // 0:i - 1:n - 2:p - 3:u - 4:t ... ... [1|2|3|4]
        connection.connection_output_id.slice(6, -1) == entity.node_id; // 0:o - 1:u - 2:t - 3:p - 4:u - 5:t ... ... [1|2|3|4]
    });
    return entity[0];
  }

  fillListOfTable(relation_entities_with_cardinality: any){
    // Create a table depends on the list of entities that are connected to the relation and the related cardinality

    const total_of_child = this.getTotalOfChild(relation_entities_with_cardinality[1]); // Total of entities which are classified as CHILD
    relation_entities_with_cardinality[1].forEach((entity_with_cardinality: any) => { // Create one table for each node.
      this.createOneTable(entity_with_cardinality[1].node_title, entity_with_cardinality[1].node_attributes);
    });
    // All are childs :           Child-Child or Child-Child-Child...(Child)
    if(total_of_child == relation_entities_with_cardinality[1].length){
      alert("CHILD : " + total_of_child + "TOTAL : " + relation_entities_with_cardinality[1].length + " -  All are childs");
    }
    // Only one is a child :            Child-Father or Child-Father-Father...(Father)
    else if(total_of_child == 1){
      alert("CHILD : " + total_of_child + "TOTAL : " + relation_entities_with_cardinality[1].length + " -  Only one child");
    }
    // All are fathers :            Father-Father or Father-Father-Father...(Father)
    else if(total_of_child == 0){
      alert("CHILD : " + total_of_child + "TOTAL : " + relation_entities_with_cardinality[1].length + " -  No child");
    }
    // Many childs(2 or more) but not all:                Father-Child-Child or Father-Child-Clild-Child...(Child)
    else{
      alert("CHILD : " + total_of_child + "TOTAL : " + relation_entities_with_cardinality[1].length + " -  2 or more childs but not all");
    }
  }

  getTotalOfChild(entities_with_cardinality: any){
    // Return the total number of entitie that has 0, 1 ro 1, 1 as cardinality to the current relation
    let total = 0;
    entities_with_cardinality.forEach((ent_card: any) => {
      if(ent_card[0] == "0, 1" || ent_card[0] == "1, 1"){
        total++;
      }
    });
    return total;
  }

  createOneTable(table_name: string, attributes: any){
    if(!this.all_tables.some((table: any) => {
      return table[0] === table_name;
    })){
      // Create the table based on the entity if it doesn't exist yet
      this.all_tables.push([
        table_name,
        attributes,
        [] // Foreign keys
      ]);
    }
  }
}
