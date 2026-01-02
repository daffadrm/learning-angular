import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    MultiSelectModule,
    ButtonModule,
    FormsModule,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent {
  products = [
    { code: 'P1001', name: 'Apple', category: 'Fruit', price: 1.2 },
    { code: 'P1002', name: 'Orange', category: 'Fruit', price: 0.9 },
    { code: 'P1003', name: 'Carrot', category: 'Vegetable', price: 0.6 },
    { code: 'P1004', name: 'Cabbage', category: 'Vegetable', price: 1.0 },
    { code: 'P1001', name: 'Apple', category: 'Fruit', price: 1.2 },
    { code: 'P1002', name: 'Orange', category: 'Fruit', price: 0.9 },
    { code: 'P1003', name: 'Carrot', category: 'Vegetable', price: 0.6 },
    { code: 'P1004', name: 'Cabbage', category: 'Vegetable', price: 1.0 },
    { code: 'P1001', name: 'Apple', category: 'Fruit', price: 1.2 },
    { code: 'P1002', name: 'Orange', category: 'Fruit', price: 0.9 },
    { code: 'P1003', name: 'Carrot', category: 'Vegetable', price: 0.6 },
    { code: 'P1004', name: 'Cabbage', category: 'Vegetable', price: 1.0 },
    { code: 'P1001', name: 'Apple', category: 'Fruit', price: 1.2 },
    { code: 'P1002', name: 'Orange', category: 'Fruit', price: 0.9 },
    { code: 'P1003', name: 'Carrot', category: 'Vegetable', price: 0.6 },
    { code: 'P1004', name: 'Cabbage', category: 'Vegetable', price: 1.0 },
  ];

  cols = [
    { field: 'name', header: 'Name' },
    { field: 'category', header: 'Category' },
    { field: 'price', header: 'Price' },
  ];

  selectedColumns = [...this.cols];

  exportCSV() {
    const dt: any = document.querySelector('p-table');
    dt.exportCSV();
  }

  exportExcel() {
    import('xlsx').then((xlsx) => {
      const data = this.products.map((p) => {
        const obj: any = { Code: p.code };
        this.selectedColumns.forEach((col) => {
          obj[col.header] = (p as any)[col.field];
        });
        return obj;
      });
      const ws = xlsx.utils.json_to_sheet(data);
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, 'Products');
      xlsx.writeFile(wb, 'products.csv');
    });
  }
}
