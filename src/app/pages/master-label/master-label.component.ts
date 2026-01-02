import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LabelStoreService } from '../../services/master-label/label-store.service';
import { dataLabel } from './dummy';

@Component({
  selector: 'app-master-label',
  imports: [CommonModule],
  templateUrl: './master-label.component.html',
  styleUrl: './master-label.component.css',
})
export class MasterLabelComponent {
  labels = dataLabel;
  constructor(private router: Router, private labelStore: LabelStoreService) {}

  edit(label: any) {
    this.labelStore.set(label.id, label);

    this.router.navigate(['/master-label/detail', label.id]);
  }
}
