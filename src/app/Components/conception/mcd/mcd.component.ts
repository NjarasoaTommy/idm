import { Component } from '@angular/core';
import { FFlowModule } from '@foblex/flow';
import { NodeComponent } from '../../graph/node/node.component';

@Component({
  selector: 'app-mcd',
  imports: [FFlowModule, NodeComponent],
  templateUrl: './mcd.component.html',
  styleUrl: './mcd.component.scss'
})
export class McdComponent {

}
