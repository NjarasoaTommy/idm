import { CommonModule } from '@angular/common';
import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'app-node',
  imports: [CommonModule],
  templateUrl: './node.component.html',
  styleUrl: './node.component.scss'
})
export class NodeComponent {
  @Input() showNodeForm!: ( // Used to send the informations about the current node when the node should be updated.
    node_id: number,
    node_type: string,
    node_title: string,
    node_attributes: any,
  ) => void;
  @Input() node_type!: string;
  @HostBinding('class') get hostClass() { // Class added to app-node(host) directly.
    return `node ${this.node_type}`;
  }
  @Input() node_id!: number;
  @Input() node_title!: string;
  @Input() node_attributes!: any;

  onSetupNode(event: MouseEvent){ // Called when the user want to update node.
    event.preventDefault();
    this.showNodeForm(this.node_id, this.node_type,this.node_title, this.node_attributes);
  }
}
