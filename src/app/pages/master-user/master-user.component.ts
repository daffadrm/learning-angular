import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { SelectModule } from 'primeng/select';
interface Column {
  field: string;
  header: string;
  type?: string;
  default?: boolean;
}
@Component({
  selector: 'app-master-user',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    MultiSelectModule,
    ButtonModule,
    FormsModule,
    SplitButtonModule,
    ConfirmDialogModule,
    FormsModule,

    DialogModule,
    InputTextModule,
    ButtonModule,
    SelectModule,
  ],
  providers: [ConfirmationService],

  templateUrl: './master-user.component.html',
  styleUrl: './master-user.component.css',
})
export class MasterUserComponent implements OnInit {
  users: any[] = [];
  cols: Column[] = [
    { field: 'name', header: 'Nama', default: true },
    { field: 'role', header: 'Role', default: true },
    { field: 'username', header: 'Username', default: true },
    { field: 'action', header: 'Aksi', type: 'action', default: true },
  ];
  selectedColumns: Column[] = [];
  loading = false;
  rows = 15;
  totalRecords = 0;
  showEditDialog = false;

  roles = [
    { label: 'Admin', value: 'admin' },
    { label: 'Staff', value: 'staff' },
  ];

  showDialog = false;
  isEdit = false;

  formUser: any = {
    id: null,
    username: '',
    name: '',
    role: '',
  };

  @ViewChild('userForm') userForm!: NgForm;

  constructor(private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this.selectedColumns = this.cols.filter((col) => col.default);
  }
  onColumnToggle() {
    const selectedFields = this.selectedColumns.map((c) => c.field);

    this.selectedColumns = this.cols.filter((col) =>
      selectedFields.includes(col.field)
    );
  }

  userList = {
    res: {
      data: [
        {
          name: 'daffa',
          username: 'daffaadmin',
          level: 1,
          role: 'admin',
        },
        {
          name: 'rayhan',
          username: 'rayhanstaff',
          level: 2,
          role: 'staff',
        },
      ],
      total: 5,
    },
  };

  loadOrders(event: any) {
    this.loading = true;

    const limit = event.rows;
    const offset = event.first;

    this.users = this.userList.res.data;
    this.totalRecords = this.userList.res.total;
    this.loading = false;

    // this.ordersService.getOrders(limit, offset).subscribe({
    //   next: (res) => {
    //     this.orders = res.data;
    //     this.totalRecords = res.total;
    //     this.loading = false;
    //   },
    //   error: () => {
    //     this.loading = false;
    //   },
    // });
  }

  onEdit(user: any) {
    this.isEdit = true;
    console.log('Edit:', user);

    this.formUser = { ...user }; // clone biar table ga langsung berubah
    this.showDialog = true;
  }

  openCreate() {
    this.isEdit = false;
    this.formUser = {
      id: null,
      username: '',
      name: '',
      role: '',
    };
    this.showDialog = true;
    setTimeout(() => {
      this.userForm.resetForm(this.formUser);
    });
  }

  onDelete(user: any) {
    this.confirmationService.confirm({
      message: 'Yakin ingin menghapus data ini?',
      header: 'Konfirmasi',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log('Deleted:', user);
      },
    });
  }

  submitForm() {
    if (this.isEdit) {
      console.log('UPDATE:', this.formUser);
      // this.userService.update(this.formUser.id, this.formUser)
    } else {
      console.log('CREATE:', this.formUser);
      // this.userService.create(this.formUser)
    }

    this.closeDialog();
  }

  closeDialog() {
    this.showDialog = false;
  }
}
