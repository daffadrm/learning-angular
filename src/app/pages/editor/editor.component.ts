import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

import * as pdfMake from 'pdfmake/build/pdfmake';
import 'pdfmake/build/vfs_fonts';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, MonacoEditorModule],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
})
export class EditorComponent {
  pdfUrl: SafeResourceUrl | null = null;
  // pdfUrl: string | null = null;

  editorCode = `
({
  pageSize: { width: 283, height: 425 },
  pageMargins: [10, 10, 10, 10],
  content: [
    { text: 'PDFMAKE PLAYGROUND', fontSize: 16, bold: true },

    {
      canvas: [
        {
          type: 'rect',
          x: 0,
          y: 0,
          w: 263,
          h: 380,
          lineWidth: 1
        }
      ]
    },

    { text: 'Nama: Daffa Rayhan', margin: [0, 20, 0, 0] },
    { text: 'Resi: AB123456789' }
  ]
})
`;
  constructor(private sanitizer: DomSanitizer) {}

  editorOptions = {
    theme: 'vs-dark',
    language: 'javascript',
    automaticLayout: true,
  };

  ngOnInit() {
    this.updatePreview();
  }
  updatePreview() {
    // try {
    //   const docDefinition = eval(this.editorCode);

    //   (pdfMake as any).createPdf(docDefinition).getBlob((blob: Blob) => {
    //     const url = URL.createObjectURL(blob);

    //     this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    //   });
    // } catch (err) {
    //   console.error('PDF Error:', err);
    // }

    // try {
    //   // pdfMake Playground style (langsung object, bukan JSON)
    //   // eslint-disable-next-line no-new-func
    //   const docDefinition = new Function(`return ${this.editorCode}`)();

    //   (pdfMake as any).createPdf(docDefinition).getBlob((blob: Blob) => {
    //     if (this.pdfUrl) URL.revokeObjectURL(this.pdfUrl);
    //     this.pdfUrl = URL.createObjectURL(blob);
    //   });
    // } catch (err) {
    //   console.error('PDF Error:', err);
    // }

    try {
      const fn = new Function(`
      "use strict";
      const doc = ${this.editorCode};
      return doc;
    `);

      const docDefinition = fn();

      // 🛡 SAFETY GUARD (WAJIB)
      if (!docDefinition || typeof docDefinition !== 'object') {
        throw new Error('Invalid docDefinition');
      }

      // 🛡 PASTIKAN images ADA
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
    this.editorCode;
    console.log(this.editorCode, 'editorCode');
  }
}
