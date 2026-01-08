import { Component } from '@angular/core';
import { TEMPLATE_DUMMY } from './dummy';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-fabric-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    DialogModule,
    FormsModule,
    ToastModule,
  ],
  templateUrl: './fabric-list.component.html',
  styleUrl: './fabric-list.component.css',
})
export class FabricListComponent {
  templates = TEMPLATE_DUMMY;

  dialogVisible = false;
  isEdit = false;

  form: any = {
    id: '',
    name: '',
    description: '',
  };

  constructor(
    private router: Router,
    private confirm: ConfirmationService,
    private message: MessageService
  ) {}

  openDetail(t: any) {
    this.router.navigate(['/fabric-editor', t.id]);
  }

  add() {
    this.isEdit = false;
    this.form = { id: '', name: '', description: '' };
    this.dialogVisible = true;
  }

  edit(row: any) {
    this.isEdit = true;
    this.form = { ...row };
    this.dialogVisible = true;
  }

  save() {
    if (this.isEdit) {
      const idx = this.templates.findIndex((t) => t.id === this.form.id);
      this.templates[idx] = { ...this.form };
    } else {
      this.templates.push({
        ...this.form,
        id: Date.now().toString(),
      });
    }

    this.dialogVisible = false;
    this.message.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Template saved',
    });
  }

  delete(row: any) {
    this.confirm.confirm({
      message: 'Yakin ingin menghapus template ini?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.templates = this.templates.filter((t) => t.id !== row.id);
        this.message.add({
          severity: 'success',
          summary: 'Deleted',
        });
      },
    });
  }
}
