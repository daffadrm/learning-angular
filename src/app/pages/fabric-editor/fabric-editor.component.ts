import { CommonModule, Location } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import * as fabric from 'fabric';
import { ButtonModule } from 'primeng/button';
import { TEMPLATE_DUMMY } from '../fabric-list/dummy';
import { ActivatedRoute } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { SplitButton } from 'primeng/splitbutton';

@Component({
  selector: 'app-fabric-editor',
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    SplitButton,
  ],
  templateUrl: './fabric-editor.component.html',
  styleUrl: './fabric-editor.component.css',
})
export class FabricEditorComponent implements AfterViewInit, OnDestroy, OnInit {
  canvas!: fabric.Canvas;
  itemsStyle: any;

  readonly WIDTH = 400;
  readonly HEIGHT = 600;
  readonly GRID_SIZE = 10;
  showGrid = true;
  selectedShape: fabric.Object | null = null;
  templateJson: any;

  formEditor: any = {
    id: null,
    name: '',
    description: '',
    canvas_json: null,
  };

  private clipboard: fabric.Object | fabric.ActiveSelection | null = null;
  private gridObjects: fabric.Object[] = [];
  private keyHandler = (e: KeyboardEvent) => this.onKeyDown(e);

  constructor(private route: ActivatedRoute, private location: Location) {
    this.itemsStyle = [
      {
        label: 'Filled',
        command: () => {
          this.setRectFilled();
        },
      },
      {
        label: 'Outline',
        command: () => {
          this.setRectOutline();
        },
      },
      {
        label: 'Radius',
        command: () => {
          this.toggleRadius();
        },
      },

      // { label: 'Angular.dev', url: 'https://angular.dev' },
      // { separator: true },
      // { label: 'Upload', routerLink: ['/fileupload'] }
    ];
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      const template = TEMPLATE_DUMMY.find((t) => t.id === id);

      if (template) {
        this.templateJson = template.canvas_json;
        this.formEditor = { ...template };

        if (this.canvas) {
          this.loadFromJson(this.templateJson);
        }
      }
    });
  }

  goBack() {
    this.location.back();
  }

  ngAfterViewInit() {
    this.canvas = new fabric.Canvas('canvas', {
      width: this.WIDTH,
      height: this.HEIGHT,
      backgroundColor: '#ffffff',
      selection: true,
      preserveObjectStacking: true,
    });

    // this.drawGrid();
    // this.enableSnapToGrid();

    if (this.templateJson) {
      this.loadFromJson(this.templateJson);
    }

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

    this.canvas.on('object:modified', (e) => {
      const obj = e.target;

      if (obj instanceof fabric.Textbox) {
        const scaleY = obj.scaleY ?? 1;

        obj.set({
          fontSize: obj.fontSize! * scaleY,
          scaleX: 1,
          scaleY: 1,
        });

        obj.setCoords();
        this.canvas.requestRenderAll();
      }
    });

    if (this.templateJson) {
      this.loadFromJson(this.templateJson);
    }
  }

  loadFromJson(json: any) {
    this.canvas.loadFromJSON(json, () => {
      this.canvas.backgroundColor = '#ffffff';
      this.canvas.renderAll();
      this.drawGrid();
      this.enableSnapToGrid();
      this.canvas.renderAll();
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
    if (!this.canvas) return;

    // hapus grid lama
    this.gridObjects.forEach((g) => this.canvas.remove(g));
    this.gridObjects = [];

    const options = {
      stroke: '#e5e7eb',
      strokeWidth: 1,
      selectable: false,
      evented: false,
      excludeFromExport: true,
      visible: true,
    };

    // vertical lines
    for (let i = 0; i <= this.WIDTH; i += this.GRID_SIZE) {
      const line = new fabric.Line([i, 0, i, this.HEIGHT], options);
      line.dirty = true;
      this.gridObjects.push(line);
      this.canvas.insertAt(0, line); // 🔥 PENTING
    }

    // horizontal lines
    for (let i = 0; i <= this.HEIGHT; i += this.GRID_SIZE) {
      const line = new fabric.Line([0, i, this.WIDTH, i], options);
      line.dirty = true;
      this.gridObjects.push(line);
      this.canvas.insertAt(0, line);
    }

    this.canvas.requestRenderAll(); // 🔥 WAJIB
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
      strokeUniform: true,
      objectCaching: true,
    });

    this.canvas.add(text);
    this.canvas.setActiveObject(text);
    this.canvas.renderAll();
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
      strokeUniform: true,
      rx: 8,
      ry: 8,
    });

    this.canvas.add(rect);
    this.canvas.setActiveObject(rect);
    this.canvas.renderAll();
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
        this.canvas.renderAll();
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
      fill: 'transparent',
      stroke: '#111827',
      strokeWidth: 2,
      strokeUniform: true,
      rx: 8,
      ry: 8,
    });

    this.canvas.add(rect);
    this.canvas.setActiveObject(rect);
    this.canvas.renderAll();
  }

  addCircle() {
    const circle = new fabric.Circle({
      left: 200,
      top: 200,
      radius: 60,
      fill: '#22c55e',
      strokeWidth: 0,
      strokeUniform: true,
    });

    this.canvas.add(circle);
    this.canvas.setActiveObject(circle);
    this.canvas.renderAll();
  }

  addTriangle() {
    const triangle = new fabric.Triangle({
      left: 220,
      top: 220,
      width: 120,
      height: 100,
      fill: '#f97316',
      strokeWidth: 0,
      strokeUniform: true,
    });

    this.canvas.add(triangle);
    this.canvas.setActiveObject(triangle);
    this.canvas.renderAll();
  }

  addLine() {
    const line = new fabric.Line([0, 0, 150, 0], {
      left: 250,
      top: 250,
      stroke: '#111827',
      strokeWidth: 2,
      strokeUniform: true,
    });

    this.canvas.add(line);
    this.canvas.setActiveObject(line);
    this.canvas.renderAll();
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

  saveCanvas() {
    if (!this.canvas) return;

    // Ambil JSON object dari canvas
    const canvasJson = this.canvas.toJSON();

    // Convert ke string JSON
    const jsonString = JSON.stringify(canvasJson, null, 2);

    console.log(jsonString); // bisa dilihat di console
  }

  newCanvas() {
    if (!this.canvas) return;

    // 🔒 lock history supaya ga nyimpen clear sebagai undo step
    // this.historyLocked = true;

    // 1. Clear canvas
    this.canvas.clear();

    // 2. Reset background
    this.canvas.set({
      backgroundColor: '#ffffff',
    });

    // 3. Reset selection
    this.selectedShape = null;

    // // 4. Reset undo / redo
    // this.undoStack = [];
    // this.redoStack = [];

    // 5. Draw grid lagi
    // this.drawGrid();
    this.enableSnapToGrid();

    // 6. Render
    this.canvas.requestRenderAll();

    // 7. Simpan initial state
    // this.historyLocked = false;
    // this.saveState();
  }

  tableData = [
    { name: 'Item A', qty: 2, price: 5000 },
    { name: 'Item B', qty: 1, price: 10000 },
    { name: 'Item C', qty: 3, price: 7500 },
  ];
  addTable() {
    const data = [
      { name: 'Item A', qty: 2, price: 5000 },
      { name: 'Item B', qty: 10, price: 10000 },
      { name: 'Item C', qty: 1, price: 7500 },
    ];

    this.createTable(data);
  }

  createTable(data: any[]) {
    if (!this.canvas) return;

    const startX = 100;
    const startY = 100;

    const colWidths = [100, 100, 140];
    const rowHeight = 40;

    const objects: fabric.Object[] = [];

    const headers = ['Name', 'Qty', 'Price'];

    /* ================= HEADER ================= */
    headers.forEach((text, colIndex) => {
      const x = colWidths.slice(0, colIndex).reduce((a, b) => a + b, 0);

      objects.push(
        new fabric.Rect({
          left: x,
          top: 0,
          width: colWidths[colIndex],
          height: rowHeight,
          fill: '#e5e7eb',
          stroke: '#111827',
          strokeWidth: 1,
          strokeUniform: true,
          selectable: false,
          evented: false,
        })
      );

      objects.push(
        new fabric.Textbox(text, {
          left: x + 8,
          top: 10,
          width: colWidths[colIndex] - 16,
          fontSize: 14,
          fontWeight: 'bold',
          fill: '#111827',
          selectable: false,
          evented: false,
        })
      );
    });

    /* ================= BODY ================= */
    data.forEach((row, rowIndex) => {
      const y = rowHeight * (rowIndex + 1);

      const values = [row.name, row.qty.toString(), row.price.toLocaleString()];

      values.forEach((value, colIndex) => {
        const x = colWidths.slice(0, colIndex).reduce((a, b) => a + b, 0);

        objects.push(
          new fabric.Rect({
            left: x,
            top: y,
            width: colWidths[colIndex],
            height: rowHeight,
            fill: '#ffffff',
            stroke: '#d1d5db',
            strokeWidth: 1,
            selectable: false,
            evented: false,
          })
        );

        objects.push(
          new fabric.Textbox(value, {
            left: x + 8,
            top: y + 10,
            width: colWidths[colIndex] - 16,
            fontSize: 13,
            fill: '#111827',
            textAlign:
              colIndex === 0 ? 'left' : colIndex === 1 ? 'center' : 'right',
            selectable: false,
            evented: false,
          })
        );
      });
    });

    /* ================= GROUP ================= */
    const tableGroup = new fabric.Group(objects, {
      left: startX,
      top: startY,
      selectable: true,
    });

    tableGroup.set('data', {
      type: 'table',
      rows: data.length,
      cols: headers.length,
    });

    this.canvas.add(tableGroup);
    this.canvas.setActiveObject(tableGroup);
    this.canvas.requestRenderAll();
  }
}
