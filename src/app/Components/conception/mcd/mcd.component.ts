import { Component } from '@angular/core';
import { FFlowModule, FConnectionContent  } from '@foblex/flow';
import { NodeComponent } from '../../graph/node/node.component';
import { FormComponent } from '../../graph/node/form/form.component';
@Component({
  selector: 'app-mcd',
  imports: [FFlowModule, NodeComponent, FConnectionContent, FormComponent],
  templateUrl: './mcd.component.html',
  styleUrl: './mcd.component.scss'
})
export class McdComponent {

}
