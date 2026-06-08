import { NgFor } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../../../Services/graph/data.service';

@Component({
  selector: 'app-connection',
  imports: [ReactiveFormsModule, NgFor],
  templateUrl: './connection.component.html',
  styleUrl: './connection.component.scss'
})
export class ConnectionComponent implements OnInit{
  connection_form!: FormGroup;

  // Informations about the current connection
  @Input() connection_id !: number;
  @Input() cardinality !: number;

  cardinalities = ["1, 1", "1, N", "N, N"]; // List of cardinalities

  constructor(private form_builder: FormBuilder, private data_service: DataService){}

  ngOnInit(): void {
    this.connection_form = this.form_builder.group({ // Initialise the form with the related data
      connection_id: [this.connection_id, Validators.required],
      cardinality: [this.cardinality, Validators.required],
    });

    this.connection_form.get('cardinality')?.valueChanges.subscribe(value => { 
      //Called each time the cardinality changes.
      const connection_id = this.connection_form.get("connection_id")?.value;
      this.data_service.updateCardinality(connection_id, value);
    })
  }
}
