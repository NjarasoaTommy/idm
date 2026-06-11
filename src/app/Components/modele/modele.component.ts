import { Component } from '@angular/core';
import { LogicService } from '../../Services/logic.service';
import { NgFor } from '@angular/common';
import { TableComponent } from './table/table.component';
@Component({
  selector: 'app-modele',
  imports: [NgFor, TableComponent],
  templateUrl: './modele.component.html',
  styleUrl: './modele.component.scss'
})
export class ModeleComponent {
  all_tables!: any;

  constructor(private logic_service: LogicService){
    this.all_tables = this.logic_service.getAllTables();
  }

  exportSql(): void {
    const sql = `
-- Script de création de table
CREATE TABLE users (
  id        INT          NOT NULL AUTO_INCREMENT,
  nom       VARCHAR(100) NOT NULL,
  email     VARCHAR(150) NOT NULL UNIQUE,
  created_at DATETIME    DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

INSERT INTO users (nom, email) VALUES ('Alice', 'alice@mail.com');
INSERT INTO users (nom, email) VALUES ('Bob',   'bob@mail.com');
    `.trim();

    this.logic_service.generateSql(sql, 'schema.sql');
  }

  exportJava(): void {
    const java = `
public class User {

    private int id;
    private String nom;
    private String email;

    public User(int id, String nom, String email) {
        this.id    = id;
        this.nom   = nom;
        this.email = email;
    }

    // Getters
    public int    getId()    { return id; }
    public String getNom()   { return nom; }
    public String getEmail() { return email; }

    // Setters
    public void setId(int id)          { this.id    = id; }
    public void setNom(String nom)     { this.nom   = nom; }
    public void setEmail(String email) { this.email = email; }
}
    `.trim();

    this.logic_service.generateJava(java, 'User.java');
  }

}
