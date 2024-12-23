package com.brscapstone1.brscapstone1.Entity;

import com.brscapstone1.brscapstone1.Constants;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = Constants.DataAnnotations.DEPARTMENT)
public class DepartmentEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int id;
  private String name;
  
  public int getId() {
    return id;
  }
  public void setId(int id) {
    this.id = id;
  }
  public String getName() {
    return name;
  }
  public void setName(String name) {
    this.name = name;
  }
  public DepartmentEntity(String name) {
    this.name = name;
  }
  public DepartmentEntity() {
    super();
  }
}
