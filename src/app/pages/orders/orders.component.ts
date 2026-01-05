import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { Order, OrdersService } from '../../services/orders/orders.service';
import { SplitButtonModule } from 'primeng/splitbutton';

interface Column {
  field: string;
  header: string;
  type?: string;
  default?: boolean;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    MultiSelectModule,
    ButtonModule,
    FormsModule,
    SplitButtonModule,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  cols: Column[] = [
    { field: 'pickup_code', header: 'Kode', default: true },
    { field: 'ordnum', header: 'No Order', default: false },
    { field: 'cust_name', header: 'Nama Pelanggan', default: true },
    { field: 'brand', header: 'Brand', default: false },
    { field: 'courier', header: 'Kurir', default: true },
    { field: 'order_date', header: 'Tanggal', type: 'date', default: true },
  ];
  selectedColumns: Column[] = [];
  loading = false;
  rows = 15;
  totalRecords = 0;

  @ViewChild('dt') table!: Table;

  exportItems = [
    {
      label: 'CSV',
      icon: 'pi pi-file',
      command: () => this.exportCSV(),
    },
    {
      label: 'Excel',
      icon: 'pi pi-file-excel',
      command: () => this.exportExcel(),
    },
    {
      separator: true,
    },
    {
      label: 'CSV (Semua Data)',
      icon: 'pi pi-database',
      command: () => this.exportAll('csv'),
    },
    {
      label: 'Excel (Semua Data)',
      icon: 'pi pi-database',
      command: () => this.exportAll('excel'),
    },
  ];

  constructor(private ordersService: OrdersService) {}

  ngOnInit() {
    this.selectedColumns = this.cols.filter((col) => col.default);
  }

  onColumnToggle() {
    const selectedFields = this.selectedColumns.map((c) => c.field);

    this.selectedColumns = this.cols.filter((col) =>
      selectedFields.includes(col.field)
    );
  }

  get filename() {
    return `orders_${new Date().toISOString().slice(0, 10)}`;
  }
  exportCSV() {
    this.table.exportCSV();
  }

  exportExcel() {
    import('xlsx').then((xlsx) => {
      const data = this.orders.map((p: any) => {
        const obj: any = { Kode: p.pickup_code };
        this.selectedColumns.forEach((col) => {
          obj[col.header] = (p as any)[col.field];
        });
        return obj;
      });
      const ws = xlsx.utils.json_to_sheet(data);
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, 'Orders');
      xlsx.writeFile(wb, `orders_${Date.now()}.xlsx`);
    });
  }

  exportAllCSV(data: any[]) {
    const fixedColumns = [{ header: 'Kode', field: 'pickup_code' }];

    const headers = [
      ...fixedColumns.map((c) => c.header),
      ...this.selectedColumns.map((c) => c.header),
    ];

    const rows = data.map((row) => {
      const values: string[] = [];

      fixedColumns.forEach((col) => {
        values.push(`"${row[col.field] ?? ''}"`);
      });

      this.selectedColumns.forEach((col) => {
        let value = row[col.field];

        if (col.type === 'date' && value) {
          value = new Date(value).toLocaleString('id-ID');
        }

        values.push(`"${value ?? ''}"`);
      });

      return values.join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = this.filename;
    link.click();

    URL.revokeObjectURL(url);
  }

  exportAllExcel(data: any[]) {
    import('xlsx').then((xlsx) => {
      const exportData = data.map((row) => {
        const obj: any = { Kode: row.pickup_code };

        this.selectedColumns.forEach((col) => {
          let value = row[col.field];

          if (col.type === 'date' && value) {
            value = new Date(value).toLocaleString('id-ID');
          }

          obj[col.header] = value ?? '';
        });

        return obj;
      });

      const worksheet = xlsx.utils.json_to_sheet(exportData);
      const workbook = xlsx.utils.book_new();

      xlsx.utils.book_append_sheet(workbook, worksheet, 'Data');
      xlsx.writeFile(workbook, `orders_${Date.now()}.xlsx`);
    });
  }

  exportAll(type: 'csv' | 'excel') {
    this.loading = true;

    this.ordersService.getOrders(this.totalRecords, 0).subscribe((res: any) => {
      if (type === 'csv') {
        this.exportAllCSV(res.data);
      } else {
        this.exportAllExcel(res.data);
      }
      this.loading = false;
    });
  }

  loadOrders(event: any) {
    this.loading = true;

    const limit = event.rows;
    const offset = event.first;

    this.ordersService.getOrders(limit, offset).subscribe({
      next: (res) => {
        this.orders = res.data;
        this.totalRecords = res.total;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
