import { Component } from '@angular/core';
import { FFlowModule, FConnectionContent  } from '@foblex/flow';
import { NodeComponent } from '../../graph/node/node.component';
import { FormComponent } from '../../graph/node/form/form.component';
import { NgFor, NgIf } from '@angular/common';
@Component({
  selector: 'app-mcd',
  imports: [FFlowModule, NodeComponent, FConnectionContent, FormComponent, NgIf, NgFor],
  templateUrl: './mcd.component.html',
  styleUrl: './mcd.component.scss'
})
export class McdComponent {
  is_node_form_showed: boolean = false;
  curent_node_id: number = -1;
  curent_node_type: string = "";
  curent_node_title: string = "";
  curent_node_attributes: any = [];

  node_list = [
    {
      node_id: 1,
      node_title: "Entité",
      node_type: "entity",
      node_attributes: [
        {
          label : "id",
          type : 'number'
        },
        {
          label : "attr1",
          type : 'string'
        },
        {
          label : "attr2",
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

  connection_list = [
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


  show_node_form = (node_id: number, node_type: string, node_title: string, node_attributes: any) => {
    this.curent_node_id = node_id;
    this.curent_node_type = node_type;
    this.curent_node_title = node_title;
    this.curent_node_attributes = node_attributes;
    this.is_node_form_showed = true;
  }

  hide_node_form = () => {
    this.is_node_form_showed = false;
  }

  get output_nodes() {
    return this.node_list.filter(n => n.node_relation_type === 'output');
  }

  get input_nodes() {
    return this.node_list.filter(n => n.node_relation_type === 'input');
  }

  get both_nodes() {
    return this.node_list.filter(n => n.node_relation_type === 'both');
  }
}
