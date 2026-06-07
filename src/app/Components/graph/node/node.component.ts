import { CommonModule } from '@angular/common';
import { Component, Input, HostBinding } from '@angular/core';
import { FormComponent } from './form/form.component';

@Component({
  selector: 'app-node',
  imports: [CommonModule, FormComponent],
  templateUrl: './node.component.html',
  styleUrl: './node.component.scss'
})
export class NodeComponent {
  @Input() type!: string;
  @HostBinding('class') get hostClass() { // Class added to app-node directly.
    return `node ${this.type}`;
  }
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
