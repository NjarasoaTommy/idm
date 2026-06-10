import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { DataService } from '../../../../Services/graph/data.service';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent implements OnInit{
  node_form!: FormGroup;

  // Variable used to initialize the form with the correct data(related to the current node)
  @Input() closeModal!: () => void;
  @Input() nodeId!: number;
  @Input() nodeType!: string;
  @Input() nodeTitle!: string;
  @Input() nodeAttributes!: any;

  constructor(private form_builder: FormBuilder, private data_service: DataService){}

  ngOnInit(){
    const all_attributes:any = []; // Used to store the list of grouped controls related to all attributes

    this.nodeAttributes.forEach((attr: any) => { // Create a field for each attribute
      all_attributes.push(this.createAttributeFields(attr.name, attr.type, attr.is_identifier));
    });

    // Initialize the form with correct data
    this.node_form = this.form_builder.group({
      node_id: [this.nodeId, Validators.required],
      node_type: [this.nodeType, Validators.required],
      entity_name: [this.nodeTitle, Validators.required],
      attributes: this.form_builder.array(all_attributes)
    });
  }

  // Getter for the form's 'attributes' fields(form array)
  get attributes(): FormArray{
    return this.node_form.get('attributes') as FormArray;
  }

  // Used to create one dynamic field for getting one attribute.
  createAttributeFields(attr_name: string = '', attr_type: string = '', is_identifier: boolean = false){
    let attribute_group;
    if(this.nodeType == 'entity'){
      attribute_group = this.form_builder.group({
        name: [attr_name, Validators.required],
        type: [attr_type, Validators.required],
        is_identifier: [is_identifier, Validators.required]
      });
    }
    else{
      attribute_group = this.form_builder.group({
        name: [attr_name, Validators.required],
        type: [attr_type, Validators.required]
      });
    }
    return attribute_group;
  }

  // Add new field for attribute in the DOM.
  addAttributeFields(){
    const attribute_group = this.createAttributeFields();
    this.attributes.push(attribute_group);
  }

  removeAttributeFields(index: number){
    this.attributes.removeAt(index);
  }

  // Call when the node form is submitted
  saveNode(){
    const node_data = this.node_form.value;

    // Update the list of node in the related service
    this.data_service.saveOneNode(
      node_data.node_id,
      node_data.node_type,
      node_data.entity_name,
      node_data.attributes,
    );
    this.closeModal();
  }
  deleteNode(){
    this.data_service.deleteOneNode(this.nodeId);
    this.closeModal();
  }
}
