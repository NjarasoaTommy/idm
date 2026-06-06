import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-node',
  imports: [CommonModule],
  templateUrl: './node.component.html',
  styleUrl: './node.component.scss'
})
export class NodeComponent {
  node_title = "Entité";
  node_attributes = [
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
  ]
}
