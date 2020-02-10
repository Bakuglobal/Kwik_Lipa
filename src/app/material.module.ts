import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatTableModule,
  MatStepperModule,
  MatFormFieldModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule,
  MatIconModule,
  MatPaginatorModule,
  MatSortModule,
  MatIconRegistry
} from "@angular/material" ;



@NgModule({
  declarations: [],
  exports: [
    CommonModule,
    MatTableModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule

  ],
  providers: [
    MatIconRegistry
  ]
})
export class MaterialModule { }
