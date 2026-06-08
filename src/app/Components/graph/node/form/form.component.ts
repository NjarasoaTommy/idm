import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule, NgFor],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent implements OnInit{
  node_form!: FormGroup;
  @Input() closeModal!: () => void;
  @Input() nodeId!: number;
  @Input() nodeType!: string;
  @Input() nodeTitle!: string;
  @Input() nodeAttributes!: any;

  constructor(private form_builder: FormBuilder){}

  ngOnInit(){
    const all_attributes:any = [];

    this.nodeAttributes.forEach((attr: any) => {
      all_attributes.push(this.createAttributeFields(attr.label, attr.type));
    });

    this.node_form = this.form_builder.group({
      node_id: [this.nodeId, Validators.required],
      node_type: [this.nodeType, Validators.required],
      entity_name: [this.nodeTitle, Validators.required],
      attributes: this.form_builder.array(all_attributes)
    });
  }

  get attributes(): FormArray{
    return this.node_form.get('attributes') as FormArray;
  }

  createAttributeFields(node_name: string = '', node_type: string = ''){
    const attribute_group = this.form_builder.group({
      name: [node_name, Validators.required],
      type: [node_type, Validators.required]
    });
    return attribute_group;
  }

  addAttributeFields(){
    const attribute_group = this.createAttributeFields();
    this.attributes.push(attribute_group);
  }

  removeAttributeFields(index: number){
    this.attributes.removeAt(index);
  }

  saveNode(){
    alert("OK");
    console.log("OK");
    console.log(this.node_form.value);
  }
}
