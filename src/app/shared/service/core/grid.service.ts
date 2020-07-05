import { Injectable } from '@angular/core';
import { MemoryService } from './memory.service';
import { CanvasOffsets } from '../../model/canvas-offsets.model';

@Injectable({
  providedIn: 'root'
})
export class GridService {
  constructor(private memory: MemoryService) {}

  // Create grid on canvas
  render(): void {
    // Initialize grid buffer
    const ctxGridBuffer: CanvasRenderingContext2D = this.memory.renderer.ctx.gridBuffer;
    const c: HTMLCanvasElement = ctxGridBuffer.canvas;
    c.width = this.memory.renderer.wrapper.clientWidth;
    c.height = this.memory.renderer.wrapper.clientHeight;

    const canvasOffsets: CanvasOffsets = this.memory.history.canvasOffsets;

    // X-axis
    const offsetX: number = canvasOffsets.newOffsetX - 1; // -1 is prefix for a border width of main canvas
    const remainX: number = Math.floor(offsetX / (this.memory.constant.GRID_SCALE * canvasOffsets.zoomRatio));
    const cutoffX: number = offsetX - remainX * this.memory.constant.GRID_SCALE * canvasOffsets.zoomRatio;

    // Y-axis
    const offsetY: number = canvasOffsets.newOffsetY - 1; // -1 is prefix for a border width of main canvas
    const remainY: number = Math.floor(offsetY / (this.memory.constant.GRID_SCALE * canvasOffsets.zoomRatio));
    const cutoffY: number = offsetY - remainY * this.memory.constant.GRID_SCALE * canvasOffsets.zoomRatio;

    // console.log(cutoffX, cutoffY);

    ctxGridBuffer.translate(0.5, 0.5);

    // Start rendering
    ctxGridBuffer.beginPath();
    ctxGridBuffer.strokeStyle = this.memory.constant.GRID_COLOR;
    ctxGridBuffer.lineWidth = 1;

    // X-axis positive
    for (let i = cutoffX; i < c.width; i += this.memory.constant.GRID_SCALE * canvasOffsets.zoomRatio) {
      ctxGridBuffer.moveTo(i, 0);
      ctxGridBuffer.lineTo(i, c.height);
    }
    // X-axis negative
    for (let i = cutoffX; i > 0; i -= this.memory.constant.GRID_SCALE * canvasOffsets.zoomRatio) {
      ctxGridBuffer.moveTo(i, 0);
      ctxGridBuffer.lineTo(i, c.height);
    }

    // Y-axis positive
    for (let i = cutoffY; i < c.height; i += this.memory.constant.GRID_SCALE * canvasOffsets.zoomRatio) {
      ctxGridBuffer.moveTo(0, i);
      ctxGridBuffer.lineTo(c.width, i);
    }
    // Y-axis negative
    for (let i = cutoffY; i > 0; i -= this.memory.constant.GRID_SCALE * canvasOffsets.zoomRatio) {
      ctxGridBuffer.moveTo(0, i);
      ctxGridBuffer.lineTo(c.width, i);
    }

    // End rendering
    ctxGridBuffer.stroke();
  }
}
