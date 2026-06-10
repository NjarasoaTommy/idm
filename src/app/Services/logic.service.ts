import { Injectable } from '@angular/core';
import { DataService } from './graph/data.service';

@Injectable({
  providedIn: 'root'
})
export class LogicService {
  all_nodes!: any;
  all_connections!: any;
  all_entities!: any;
  all_relations: any;

  relation_entities: any = []; // Store the correspondance of relation and their entities
  constructor(private data_service: DataService) {
    this.all_nodes = this.data_service.getAllNodes();
    this.all_connections = this.data_service.getAllConnections();
    this.all_entities = this.all_nodes.filter((node: any) => {
      return node.node_type == "entity";
    });
    this.all_relations = this.all_nodes.filter((node: any) => {
      return node.node_type == "relation";
    });
  }

  getAllTables(){
    this.all_relations.forEach((relation: any) => {
      // Get the list of entities connected to the current relation.
      const all_connected_entities = this.getConnectedEntities(relation.node_id);
      this.relation_entities.push([relation, all_connected_entities]) // [current_relation + all conneted_entities(+cardinality)]
    });

    console.log("---------------------------------------");
    console.log(this.relation_entities);
    console.log("---------------------------------------");

    return {
      "Connections" : this.all_connections,
      "Relations" : this.all_relations,
      "Entités" : this.all_entities
    };
  }

  getConnectedEntities(relation_id: string){ // ENTITY - RELATION
    // Returns the list of entities connected to the relation with its cardinality
    const related_connections = this.getConnectionsByRelationId(relation_id);
    const connected_entities: any = [];
    related_connections.forEach((connection: any) => {
      const entitie_connected_to_current_connection = this.getEntitieByConnection(connection);

      // [connection_id, entity_data(full)]
      connected_entities.push([connection.connection_label, entitie_connected_to_current_connection])
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
  
  getEntitieByConnection(connection: any){ // ENTITE - CONNECTION
    // Returns all entities that are connected to the current connection
    const entitie = this.all_entities.filter((entity: any) => { // Filter only inside entity(Make sure that we will get only 1 entity)
      return connection.connection_input_id.slice(5, -1) == entity.node_id || // 0:i - 1:n - 2:p - 3:u - 4:t ... ... [1|2|3|4]
        connection.connection_output_id.slice(6, -1) == entity.node_id; // 0:o - 1:u - 2:t - 3:p - 4:u - 5:t ... ... [1|2|3|4]
    });
    return entitie;
  }
}
