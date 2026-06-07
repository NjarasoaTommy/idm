import { Component } from '@angular/core';
import { FFlowModule, FConnectionContent  } from '@foblex/flow';
import { NodeComponent } from '../../graph/node/node.component';
import { FormComponent } from '../../graph/node/form/form.component';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-mcd',
  imports: [FFlowModule, NodeComponent, FConnectionContent, FormComponent, NgIf],
  templateUrl: './mcd.component.html',
  styleUrl: './mcd.component.scss'
})
export class McdComponent {
  is_node_form_showed: boolean = true;

  show_node_form = () => {
    this.is_node_form_showed = true;
  }

  hide_node_form = () => {
    this.is_node_form_showed = false;
  }
}
