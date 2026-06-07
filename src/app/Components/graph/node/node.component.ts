import { CommonModule } from '@angular/common';
import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'app-node',
  imports: [CommonModule],
  templateUrl: './node.component.html',
  styleUrl: './node.component.scss'
})
export class NodeComponent {
  @Input() showNodeForm!: () => void;
  @Input() node_type!: string;
  @HostBinding('class') get hostClass() { // Class added to app-node directly.
    return `node ${this.node_type}`;
  }
  @Input() node_id!: number;
  @Input() node_title!: string;
  @Input() node_attributes!: any;

  onSetupNode(event: MouseEvent){
    event.preventDefault();
    this.showNodeForm();
  }
}
