import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule, NgFor],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  node_form!: FormGroup;
  @Input() closeModal!: () => void;

  constructor(private form_builder: FormBuilder){
    this.node_form = this.form_builder.group({
      entity_name: ["", Validators.required],
      attributes: this.form_builder.array([])
    });
  }

  get attributes(): FormArray{
    return this.node_form.get('attributes') as FormArray;
  }

  addAttributeFields(){
    const attribute_group = this.form_builder.group({
      name: ['', Validators.required],
      type: ['', Validators.required]
    });
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
