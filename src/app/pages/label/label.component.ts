import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import Konva from 'konva';
import jsPDF from 'jspdf';

interface LabelNode {
  id: string;
  type: 'text' | 'rect';
  attrs: any;
}

@Component({
  selector: 'app-label',
  imports: [CommonModule],
  templateUrl: './label.component.html',
  styleUrl: './label.component.css',
})
export class LabelComponent implements AfterViewInit {
  @ViewChild('stageContainer') stageContainer!: ElementRef<HTMLDivElement>;

  stage!: Konva.Stage;
  layer!: Konva.Layer;
  transformer!: Konva.Transformer;

  nodes: LabelNode[] = [];

  ngAfterViewInit() {
    this.initStage();
  }

  initStage() {
    this.stage = new Konva.Stage({
      container: this.stageContainer.nativeElement,
      width: 378,
      height: 567,
    });

    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    this.transformer = new Konva.Transformer({
      rotateEnabled: true,
      resizeEnabled: true,
    });
    this.layer.add(this.transformer);

    this.stage.on('click', (e) => {
      if (e.target === this.stage) {
        this.transformer.nodes([]);
      }
    });
  }

  addText() {
    const text = new Konva.Text({
      id: crypto.randomUUID(),
      x: 20,
      y: 20,
      text: 'Double click to edit',
      fontSize: 14,
      fill: '#000',
      draggable: true,
    });

    this.enableTextEdit(text);
    this.registerNode(text, 'text');
  }

  enableTextEdit(textNode: Konva.Text) {
    textNode.on('dblclick dbltap', () => {
      this.transformer.nodes([]);

      const textPosition = textNode.getAbsolutePosition();
      const stageBox = this.stage.container().getBoundingClientRect();

      const areaPosition = {
        x: stageBox.left + textPosition.x,
        y: stageBox.top + textPosition.y,
      };

      const textarea = document.createElement('textarea');
      document.body.appendChild(textarea);

      textarea.value = textNode.text();
      textarea.style.position = 'absolute';
      textarea.style.top = areaPosition.y + 'px';
      textarea.style.left = areaPosition.x + 'px';
      textarea.style.width = textNode.width() + 'px';
      textarea.style.fontSize = textNode.fontSize() + 'px';
      textarea.style.border = '1px solid #ccc';
      textarea.style.padding = '2px';
      textarea.style.margin = '0';
      textarea.style.overflow = 'hidden';
      textarea.style.background = 'white';
      textarea.style.outline = 'none';
      textarea.style.resize = 'none';

      textarea.focus();

      const removeTextarea = (save = true) => {
        if (save) {
          textNode.text(textarea.value);
        }
        textarea.remove();
        this.layer.draw();
      };

      textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          removeTextarea(true);
        }
        if (e.key === 'Escape') {
          removeTextarea(false);
        }
      });

      textarea.addEventListener('blur', () => {
        removeTextarea(true);
      });
    });
  }

  addRect() {
    const rect = new Konva.Rect({
      id: crypto.randomUUID(),
      x: 20,
      y: 60,
      width: 200,
      height: 80,
      stroke: '#000',
      strokeWidth: 1,

      draggable: true,
    });

    this.registerNode(rect, 'rect');
  }

  deleteSelected() {
    if (!this.selectedNode) return;

    this.transformer.nodes([]);

    this.selectedNode.destroy();
    this.selectedNode = null;

    this.layer.draw();
  }

  selectedNode: Konva.Shape | Konva.Group | null = null;

  registerNode(node: Konva.Shape | Konva.Group, type: 'text' | 'rect') {
    node.on('click', (e) => {
      e.cancelBubble = true;

      this.selectedNode = node;
      this.transformer.nodes([node]);
      this.layer.draw();
    });

    this.layer.add(node);
    this.layer.draw();

    this.stage.on('click', (e) => {
      if (e.target === this.stage) {
        this.selectedNode = null;
        this.transformer.nodes([]);
        this.layer.draw();
      }
    });
  }

  exportJSON() {
    const json = {
      stage: {
        width: this.stage.width(),
        height: this.stage.height(),
      },
      nodes: this.layer
        .getChildren()
        .filter((n) => n !== this.transformer)
        .map((node) => ({
          id: node.id(),
          type: node.getClassName().toLowerCase(),
          attrs: node.getAttrs(),
        })),
    };

    const blob = new Blob([JSON.stringify(json, null, 2)], {
      type: 'application/json',
    });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'label-template.json';
    link.click();
  }

  importJSON(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const data = JSON.parse(reader.result as string);
      this.loadFromJSON(data);
    };
    reader.readAsText(file);
  }

  loadFromJSON(data: any) {
    this.layer.destroyChildren();
    this.layer.add(this.transformer);

    data.nodes.forEach((node: any) => {
      let shape;

      if (node.type === 'text') {
        shape = new Konva.Text(node.attrs);
      } else if (node.type === 'rect') {
        shape = new Konva.Rect(node.attrs);
      }

      if (shape) {
        this.registerNode(shape, node.type);
      }
    });

    this.layer.draw();
  }

  bringToFront() {
    if (!this.selectedNode) return;
    this.selectedNode.moveToTop();
    this.layer.draw();
  }

  sendToBack() {
    if (!this.selectedNode) return;
    this.selectedNode.moveToBottom();
    this.layer.draw();
  }

  bringForward() {
    if (!this.selectedNode) return;
    this.selectedNode.moveUp();
    this.layer.draw();
  }

  sendBackward() {
    if (!this.selectedNode) return;
    this.selectedNode.moveDown();
    this.layer.draw();
  }

  updateText(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (this.selectedNode instanceof Konva.Text) {
      this.selectedNode.text(value);
      this.layer.draw();
    }
  }

  updateFontSize(event: Event) {
    const value = Number((event.target as HTMLInputElement).value);
    if (this.selectedNode instanceof Konva.Text) {
      this.selectedNode.fontSize(value);
      this.layer.draw();
    }
  }

  updateFill(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (this.selectedNode instanceof Konva.Text) {
      this.selectedNode.fill(value);
      this.layer.draw();
    }
  }

  ngOnInit() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  ngOnDestroy() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = (e: KeyboardEvent) => {
    if (!this.selectedNode) return;

    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      this.deleteSelected();
    }
  };

  exportPDF() {
    if (!this.stage) return;

    // === ukuran label (samakan dengan stage) ===
    const widthPx = this.stage.width();
    const heightPx = this.stage.height();

    // px → mm (96 DPI)
    const pxToMm = 0.264583;
    const pdfWidth = widthPx * pxToMm;
    const pdfHeight = heightPx * pxToMm;

    const pdf = new jsPDF({
      orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
      unit: 'mm',
      format: [pdfWidth, pdfHeight],
    });

    // render canvas ke image
    const dataURL = this.stage.toDataURL({
      pixelRatio: 3, // WAJIB biar tajam waktu print
    });

    pdf.addImage(dataURL, 'PNG', 0, 0, pdfWidth, pdfHeight);

    pdf.save('label-pengiriman.pdf');
  }
}
