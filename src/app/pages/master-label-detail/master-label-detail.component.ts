import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

import * as pdfMake from 'pdfmake/build/pdfmake';
import 'pdfmake/build/vfs_fonts';
import { LabelStoreService } from '../../services/master-label/label-store.service';

@Component({
  selector: 'app-master-label-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, MonacoEditorModule, RouterLink],
  templateUrl: './master-label-detail.component.html',
  styleUrl: './master-label-detail.component.css',
})
export class MasterLabelDetailComponent {
  pdfUrl: SafeResourceUrl | null = null;

  labelId!: string;

  label: any;

  editorCode = '';

  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private router: Router,
    private labelStore: LabelStoreService
  ) {
    // const nav = this.router.getCurrentNavigation();
    // this.label = nav?.extras?.state?.['label'];
    // if (!this.label) {
    //   // fallback kalau di-refresh
    //   this.router.navigate(['/master-label']);
    // }
  }

  editorOptions = {
    theme: 'vs-dark',
    language: 'javascript',
    automaticLayout: true,
  };

  objectToJsCode(obj: any, indent = 2): string {
    const space = ' '.repeat(indent);

    if (Array.isArray(obj)) {
      return `[\n${obj
        .map((v) => space + this.objectToJsCode(v, indent + 2))
        .join(',\n')}\n${' '.repeat(indent - 2)}]`;
    }

    if (typeof obj === 'object' && obj !== null) {
      return `{\n${Object.entries(obj)
        .map(([k, v]) => `${space}${k}: ${this.objectToJsCode(v, indent + 2)}`)
        .join(',\n')}\n${' '.repeat(indent - 2)}}`;
    }

    if (typeof obj === 'string') {
      return `'${obj.replace(/'/g, "\\'")}'`;
    }

    return String(obj);
  }

  ngOnInit() {
    this.labelId = this.route.snapshot.paramMap.get('id')!;
    // this.editorCode = `(${JSON.stringify(this.label.layout, null, 2)})`;

    // const layout = this.label.layout;
    this.label = this.labelStore.get(this.labelId);

    if (!this.label) {
      // fallback jika refresh / direct access
      this.router.navigate(['/master-label']);
      return;
    }

    this.editorCode = `
(${this.objectToJsCode(this.label.layout)})
`;
    // const label = this.labelStore.get(this.labelId);

    // convert ke JS code (template literal content)
    // this.editorCode = `
    // (${this.objectToJsCode(layout)})
    // `;

    //     this.editorCode = `
    // (${this.objectToJsCode(label.layout)})
    // `;
    this.updatePreview();
  }

  updatePreview() {
    try {
      const fn = new Function(`
        "use strict";
        const doc = ${this.editorCode};
        return doc;
      `);

      const docDefinition = fn();

      if (!docDefinition || typeof docDefinition !== 'object') {
        throw new Error('Invalid docDefinition');
      }

      docDefinition.images ??= {};

      (pdfMake as any).createPdf(docDefinition).getBlob((blob: Blob) => {
        const url = URL.createObjectURL(blob);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      });
    } catch (err) {
      console.error('PDF Error:', err);
    }
  }

  saveCode() {
    try {
      const code = this.editorCode.trim();

      const fn = new Function(`
      "use strict";
      return ${code};
    `);

      const layoutObject = fn();

      if (!layoutObject || typeof layoutObject !== 'object') {
        throw new Error('Invalid layout object');
      }

      if (!layoutObject.content) {
        throw new Error('content is required');
      }

      console.log('RESULT OBJECT:', layoutObject);

      // ✅ INI YANG KAMU SIMPAN
      // this.label.layout = layoutObject;
      // call API save layoutObject
    } catch (err) {
      console.error('SAVE ERROR:', err);
    }
  }
}
