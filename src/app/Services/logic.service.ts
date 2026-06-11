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
    this.relation_entities = []; // Reset before getting the new list of tables.
    this.all_tables = []; // Reset before getting the new list of tables.

    this.updateAllEntitiesList();
    this.updateAllRelationsList();

    this.all_relations.forEach((relation: any) => {
      // Get the list of entities connected to the current relation.
      const all_connected_entities = this.getConnectedEntities(relation.node_id);
      this.relation_entities.push([relation, all_connected_entities]) // [current_relation + all conneted_entities(+cardinality)]
    });

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
      const relation_attributes = this.getRelationAttributes(relation_entities_with_cardinality[0]);
      let all_primary_keys = this.getAllPrimaryKeys(relation_entities_with_cardinality[1]);
      relation_entities_with_cardinality[1].forEach((entity_with_cardinality: any) => {
        if(entity_with_cardinality[0] == "0, 1" || entity_with_cardinality[0] == "1, 1"){ // Child
          this.addRelationAttributesToTable(entity_with_cardinality[1].node_title, relation_attributes);
          all_primary_keys = all_primary_keys.filter((key: any) => { // Remove the primary key of the Child
            return !entity_with_cardinality[1].node_attributes.some((attr: any) => attr.name == key.name);
          });
          this.addForeignKeysForTable(entity_with_cardinality[1].node_title, all_primary_keys); // Add the others primary keys as foreign keys
        }
      });
    }
    // All are fathers :            Father-Father or Father-Father-Father...(Father)
    else if(total_of_child == 0){
      const relation_attributes = this.getRelationAttributes(relation_entities_with_cardinality[0]);
      let all_primary_keys = this.getAllPrimaryKeys(relation_entities_with_cardinality[1]);
      this.createOneTable(
        relation_entities_with_cardinality[0].node_title, // Table name = Relation name
        [...all_primary_keys, ...relation_attributes] // Table attributes = All primary keys of the connected entities + Relation attributes
      );
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

  getRelationAttributes(relation: any, add_primary_key: boolean = true){
    // Get all attributes inside a relation.
    if(add_primary_key){
      const relation_attributes: any = [...relation.node_attributes];
      relation_attributes.forEach((attr: any) => {
        attr.is_primary = false;
      });
      return relation_attributes;
    }
    else{
      return relation.node_attributes;
    }
  }

  addRelationAttributesToTable(table_name: string, relation_attributes: any){
    // Append all relation attributes to the specified table
    let current_table = this.all_tables.filter((table: any) => {
      return table[0] == table_name;
    });
    current_table = current_table[0]; // Filter returns only one item(unique entity name)
    current_table[1] = [...current_table[1], ...relation_attributes];
  }

  getAllPrimaryKeys(list_of_entity_with_cardinality: any){
    const primary_keys: any = [];
    list_of_entity_with_cardinality.forEach((entity_with_cardinality: any) => {
      entity_with_cardinality[1].node_attributes.forEach((attr: any) => {
        if(attr.is_identifier){
          primary_keys.push(attr);
        }
      });
    });
    return primary_keys;
  }

  addForeignKeysForTable(table_name: string, foreign_keys: any){
    // foreign keys to the specified table
    let current_table = this.all_tables.filter((table: any) => {
      return table[0] == table_name;
    });
    current_table = current_table[0]; // Filter returns only one item(unique entity name)
    current_table[2] = [...current_table[2], ...foreign_keys];
  }


  // File generation
  private downloadFile(content: string, fileName: string): void {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();

    // Momery cleanup
    window.URL.revokeObjectURL(url);
    anchor.remove();
  }

  generateSql(sqlContent: string, fileName: string = 'export.sql'): void {
    this.downloadFile(sqlContent, fileName);
  }

  generateJava(javaContent: string, fileName: string = 'MyClass.java'): void {
    this.downloadFile(javaContent, fileName);
  }
}
