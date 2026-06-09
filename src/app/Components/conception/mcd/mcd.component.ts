import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FFlowModule, FConnectionContent,  FExternalItem, FCreateNodeEvent } from '@foblex/flow';
import { NodeComponent } from '../../graph/node/node.component';
import { FormComponent } from '../../graph/node/form/form.component';
import { NgFor, NgIf } from '@angular/common';
import { DataService } from '../../../Services/graph/data.service';
import { Subscription } from 'rxjs';
import { ConnectionComponent } from '../../graph/connection/connection.component';

@Component({
  selector: 'app-mcd',
  imports: [FFlowModule, FExternalItem, NodeComponent, FConnectionContent, FormComponent, ConnectionComponent, NgIf, NgFor],
  templateUrl: './mcd.component.html',
  styleUrl: './mcd.component.scss',
})
export class McdComponent implements OnDestroy {
  is_node_form_showed: boolean = false; // Control when to show or to hide the node form.
  // Used to initialize the node form
  curent_node_id: number = -1;
  curent_node_type: string = "";
  curent_node_title: string = "";
  curent_node_attributes: any = [];

  node_list: any = [];
  connection_list: any = [];
  node_list_subscription!: Subscription; // Used to be aware of node update
  connection_list_subscription!: Subscription; // Used to be aware of connection update

  constructor(private data_service: DataService, private cdr: ChangeDetectorRef){
    // Subscribe for dynamic data(node and connection)
    this.node_list_subscription =  this.data_service.node_list$.subscribe((all_nodes: any) => {
      this.node_list = all_nodes;
      this.cdr.markForCheck(); // Force the detection of changes
    });

    this.connection_list_subscription =  this.data_service.connection_list$.subscribe((all_connections: any) => {
      this.connection_list = all_connections;
    });
  }

  show_node_form = (node_id: number, node_type: string, node_title: string, node_attributes: any) => {
    // Called when the node form should be opened.
    this.curent_node_id = node_id;
    this.curent_node_type = node_type;
    this.curent_node_title = node_title;
    this.curent_node_attributes = node_attributes;

    // Update all needed data and show the form.
    this.is_node_form_showed = true;
  }

  hide_node_form = () => {
    this.is_node_form_showed = false;
  }

  //Methods used to get nodes depends on their type(output, input, both)
  get output_nodes() {
    return this.node_list.filter((n: any) => n.node_relation_type === 'output');
  }

  get input_nodes() {
    return this.node_list.filter((n: any) => n.node_relation_type === 'input');
  }

  get both_nodes() {
    return this.node_list.filter((n: any) => n.node_relation_type === 'both');
  }

  ngOnDestroy(){
    // Unsubscribe after destroying component.
    this.node_list_subscription.unsubscribe();
    this.connection_list_subscription.unsubscribe();
  }

  protected onCreateNode(event: FCreateNodeEvent): void { // Used after the drag and drop for node(entity or relation)
    this.data_service.create_node_object(
      event.data?.type,
      event.rect, // The current position(after drop)
      event.data?.type == "output" ? ["both", "left", "right"] : ["output", "right"]
    );
  }
}
