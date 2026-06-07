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
          type : 'text'
        },
        {
          label : "attr2",
          type : 'boolean'
        }
      ],
      node_position: { x: 32, y: 32 },
      node_connection_side: "right",
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
          type : 'text'
        },
        {
          label : "Rel_attr2",
          type : 'boolean'
        }
      ],
      node_position: { x: 240, y: 32 },
      node_connection_side: "left",
      node_relation_type: "input",
      node_input_id: "input1"
    }
  ]


  show_node_form = () => {
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
}
