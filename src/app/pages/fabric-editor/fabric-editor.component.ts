import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import * as fabric from 'fabric';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-fabric-editor',
  imports: [CommonModule, ButtonModule],
  templateUrl: './fabric-editor.component.html',
  styleUrl: './fabric-editor.component.css',
})
export class FabricEditorComponent implements AfterViewInit, OnDestroy {
  canvas!: fabric.Canvas;

  readonly WIDTH = 800;
  readonly HEIGHT = 600;
  readonly GRID_SIZE = 10;
  showGrid = true;
  selectedShape: fabric.Object | null = null;

  private clipboard: fabric.Object | fabric.ActiveSelection | null = null;
  private gridObjects: fabric.Object[] = [];
  private keyHandler = (e: KeyboardEvent) => this.onKeyDown(e);

  ngAfterViewInit() {
    this.canvas = new fabric.Canvas('canvas', {
      width: this.WIDTH,
      height: this.HEIGHT,
      backgroundColor: '#ffffff',
      selection: true,
      preserveObjectStacking: true,
    });

    this.drawGrid();
    this.enableSnapToGrid();

    window.addEventListener('keydown', this.keyHandler);
    this.canvas.on('selection:created', (e) => {
      this.handleSelection(e.selected);
    });

    this.canvas.on('selection:updated', (e) => {
      this.handleSelection(e.selected);
    });

    this.canvas.on('selection:cleared', () => {
      this.selectedShape = null;
    });
  }

  ngOnDestroy() {
    window.removeEventListener('keydown', this.keyHandler);
  }
  handleSelection(selected?: fabric.Object[]) {
    const obj = selected?.[0];

    if (
      obj instanceof fabric.Rect ||
      obj instanceof fabric.Circle ||
      obj instanceof fabric.Triangle
    ) {
      this.selectedShape = obj;
    } else {
      this.selectedShape = null;
    }
  }
  setRectFilled() {
    if (!this.selectedShape) return;

    this.selectedShape.set({
      fill: '#3b82f6',
      stroke: undefined,
      strokeWidth: 0,
    });

    this.canvas.renderAll();
  }

  setRectOutline() {
    if (!this.selectedShape) return;

    this.selectedShape.set({
      fill: 'transparent',
      stroke: '#111827',
      strokeWidth: 2,
    });

    this.canvas.renderAll();
  }
  // ================= GRID =================
  drawGrid() {
    this.gridObjects = [];

    for (let i = 0; i <= this.WIDTH / this.GRID_SIZE; i++) {
      const line = new fabric.Line(
        [i * this.GRID_SIZE, 0, i * this.GRID_SIZE, this.HEIGHT],
        {
          stroke: '#e5e7eb',
          selectable: false,
          evented: false,
          excludeFromExport: true,
        }
      );

      this.gridObjects.push(line);
      this.canvas.add(line);
    }

    for (let i = 0; i <= this.HEIGHT / this.GRID_SIZE; i++) {
      const line = new fabric.Line(
        [0, i * this.GRID_SIZE, this.WIDTH, i * this.GRID_SIZE],
        {
          stroke: '#e5e7eb',
          selectable: false,
          evented: false,
          excludeFromExport: true,
        }
      );

      this.gridObjects.push(line);
      this.canvas.add(line);
    }

    // pastikan grid di background
    this.gridObjects.forEach((g) => this.canvas.sendObjectToBack(g));
  }

  enableSnapToGrid() {
    this.canvas.on('object:moving', (e) => {
      const obj = e.target;
      if (!obj) return;

      obj.set({
        left: Math.round(obj.left! / this.GRID_SIZE) * this.GRID_SIZE,
        top: Math.round(obj.top! / this.GRID_SIZE) * this.GRID_SIZE,
      });
    });
  }

  // ================= ADD ELEMENTS =================
  addText() {
    const text = new fabric.Textbox('Edit text', {
      left: 100,
      top: 100,
      fontSize: 24,
      fill: '#000000',
    });

    this.canvas.add(text);
    this.canvas.setActiveObject(text);
  }

  addRect() {
    const rect = new fabric.Rect({
      left: 150,
      top: 150,
      width: 200,
      height: 100,
      fill: '#3b82f6',
      stroke: undefined,
      strokeWidth: 0,
      rx: 8,
      ry: 8,
    });

    this.canvas.add(rect);
    this.canvas.setActiveObject(rect);
  }
  toggleRectMode() {
    const obj = this.canvas.getActiveObject();

    if (!obj || !(obj instanceof fabric.Rect)) return;

    const isOutline = !obj.fill || obj.fill === 'transparent';

    if (isOutline) {
      // ➜ jadi FILLED
      obj.set({
        fill: '#3b82f6',
        stroke: undefined,
        strokeWidth: 0,
      });
    } else {
      // ➜ jadi OUTLINE
      obj.set({
        fill: 'transparent',
        stroke: '#111827',
        strokeWidth: 2,
      });
    }

    this.canvas.renderAll();
  }

  addImage(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const reader = new FileReader();
    reader.onload = () => {
      fabric.Image.fromURL(reader.result as string).then((img) => {
        img.scale(0.5);
        img.set({ left: 200, top: 200 });
        this.canvas.add(img);
        this.canvas.setActiveObject(img);
      });
    };

    reader.readAsDataURL(input.files[0]);
    input.value = '';
  }

  // ================= STYLE =================
  setFill(color: string) {
    const objects = this.canvas.getActiveObjects();
    if (!objects.length) return;

    objects.forEach((obj) => {
      if ('set' in obj) {
        obj.set('fill', color);
      }
    });

    this.canvas.renderAll();
  }

  // ================= KEYBOARD =================
  onKeyDown(e: KeyboardEvent) {
    if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      this.copy();
      return;
    }

    if (e.ctrlKey && e.key === 'v') {
      e.preventDefault();
      this.paste();
      return;
    }

    const obj = this.canvas.getActiveObject();
    if (!obj) return;

    const STEP = e.shiftKey ? 10 : 1;

    switch (e.key) {
      case 'Delete':
        this.canvas.remove(obj);
        this.canvas.discardActiveObject();
        break;
      case 'ArrowUp':
        obj.top! -= STEP;
        break;
      case 'ArrowDown':
        obj.top! += STEP;
        break;
      case 'ArrowLeft':
        obj.left! -= STEP;
        break;
      case 'ArrowRight':
        obj.left! += STEP;
        break;
      default:
        return;
    }

    obj.setCoords();
    this.canvas.renderAll();
  }

  copy() {
    const activeObject = this.canvas.getActiveObject();
    if (!activeObject) return;

    activeObject.clone().then((cloned) => {
      this.clipboard = cloned;
    });
  }
  paste() {
    if (!this.clipboard) return;

    this.clipboard.clone().then((clonedObj: any) => {
      this.canvas.discardActiveObject();

      clonedObj.set({
        left: (clonedObj.left ?? 0) + 10,
        top: (clonedObj.top ?? 0) + 10,
        evented: true,
      });

      if (clonedObj.type === 'activeSelection') {
        // multi select
        clonedObj.canvas = this.canvas;
        clonedObj.forEachObject((obj: fabric.Object) => {
          this.canvas.add(obj);
        });
        clonedObj.setCoords();
      } else {
        this.canvas.add(clonedObj);
      }

      this.canvas.setActiveObject(clonedObj);
      this.canvas.renderAll();
    });
  }

  toggleGrid() {
    this.showGrid = !this.showGrid;

    this.gridObjects.forEach((line) => {
      line.set('visible', this.showGrid);
    });

    this.canvas.renderAll();
  }

  addOutlineRect() {
    const rect = new fabric.Rect({
      left: 150,
      top: 150,
      width: 200,
      height: 100,
      fill: 'transparent', // ❗ tidak ada background
      stroke: '#111827', // warna border
      strokeWidth: 2,
      rx: 8,
      ry: 8,
    });

    this.canvas.add(rect);
    this.canvas.setActiveObject(rect);
  }

  addCircle() {
    const circle = new fabric.Circle({
      left: 200,
      top: 200,
      radius: 60,
      fill: '#22c55e',
      strokeWidth: 0,
    });

    this.canvas.add(circle);
    this.canvas.setActiveObject(circle);
  }

  addTriangle() {
    const triangle = new fabric.Triangle({
      left: 220,
      top: 220,
      width: 120,
      height: 100,
      fill: '#f97316',
      strokeWidth: 0,
    });

    this.canvas.add(triangle);
    this.canvas.setActiveObject(triangle);
  }

  addLine() {
    const line = new fabric.Line([0, 0, 150, 0], {
      left: 250,
      top: 250,
      stroke: '#111827',
      strokeWidth: 3,
    });

    this.canvas.add(line);
    this.canvas.setActiveObject(line);
  }

  toggleRadius() {
    const obj = this.canvas.getActiveObject();

    if (!obj || !(obj instanceof fabric.Rect)) return;

    const hasRadius = (obj.rx ?? 0) > 0;

    obj.set({
      rx: hasRadius ? 0 : 12,
      ry: hasRadius ? 0 : 12,
    });

    this.canvas.renderAll();
  }
}
