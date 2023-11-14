import type { IPointLike } from '@visactor/vutils';
import type { IRect } from '../../typings/common';
import type { Editor } from '../editor';
import { editorContainerId, minResizeHeight, minResizeWidth } from '../../config/editor';

// TODO: maybe refactor with vgrammar mark
export class ResizeController {
  private editor: Editor;
  private container: HTMLElement;

  // resize elements
  private resizeContainer!: HTMLDivElement;
  private resizeBorderLeft!: HTMLDivElement;
  private resizeBorderRight!: HTMLDivElement;
  private resizeBorderTop!: HTMLDivElement;
  private resizeBorderBottom!: HTMLDivElement;
  private resizeAnchorLeftTop!: HTMLDivElement;
  private resizeAnchorLeftBottom!: HTMLDivElement;
  private resizeAnchorRightTop!: HTMLDivElement;
  private resizeAnchorRightBottom!: HTMLDivElement;

  private rect: IRect = { x: 0, y: 0, width: 0, height: 0 };
  private isDragging: boolean = false;
  private startRect: IRect = { x: 0, y: 0, width: 0, height: 0 };
  private startPoint: IPointLike = { x: 0, y: 0 };
  // bits: left right top bottom move
  private resizeMode: number = 0;

  // eslint-disable-next-line
  private resizeListeners: ((event: any, nextRect: IRect) => void)[] = [];
  // eslint-disable-next-line
  private resizeEndListeners: ((event: any, nextRect: IRect) => void)[] = [];

  constructor(editor: Editor, container?: HTMLElement) {
    this.editor = editor;
    this.container = container ?? document.getElementById(editorContainerId)!;
    this.init();
  }

  init() {
    // <div className="resize-container">
    //   <div className="resize-border resize-border-left"></div>
    //   <div className="resize-border resize-border-right"></div>
    //   <div className="resize-border resize-border-top"></div>
    //   <div className="resize-border resize-border-bottom"></div>
    //   <div className="resize-anchor resize-anchor-left-top"></div>
    //   <div className="resize-anchor resize-anchor-left-bottom"></div>
    //   <div className="resize-anchor resize-anchor-right-top"></div>
    //   <div className="resize-anchor resize-anchor-right-bottom"></div>
    // </div>

    // init dom
    this.resizeContainer = document.createElement('div');
    this.resizeContainer.classList.add('resize-container');

    this.resizeBorderLeft = document.createElement('div');
    this.resizeBorderLeft.classList.add('resize-border', 'resize-border-left');
    this.resizeBorderRight = document.createElement('div');
    this.resizeBorderRight.classList.add('resize-border', 'resize-border-right');
    this.resizeBorderTop = document.createElement('div');
    this.resizeBorderTop.classList.add('resize-border', 'resize-border-top');
    this.resizeBorderBottom = document.createElement('div');
    this.resizeBorderBottom.classList.add('resize-border', 'resize-border-bottom');

    this.resizeAnchorLeftTop = document.createElement('div');
    this.resizeAnchorLeftTop.classList.add('resize-anchor', 'resize-anchor-left-top');
    this.resizeAnchorLeftBottom = document.createElement('div');
    this.resizeAnchorLeftBottom.classList.add('resize-anchor', 'resize-anchor-left-bottom');
    this.resizeAnchorRightTop = document.createElement('div');
    this.resizeAnchorRightTop.classList.add('resize-anchor', 'resize-anchor-right-top');
    this.resizeAnchorRightBottom = document.createElement('div');
    this.resizeAnchorRightBottom.classList.add('resize-anchor', 'resize-anchor-right-bottom');

    // init events
    this.resizeAnchorLeftTop.addEventListener('mousedown', this.onDragStart(0b10100));
    this.resizeAnchorLeftBottom.addEventListener('mousedown', this.onDragStart(0b10010));
    this.resizeAnchorRightTop.addEventListener('mousedown', this.onDragStart(0b01100));
    this.resizeAnchorRightBottom.addEventListener('mousedown', this.onDragStart(0b01010));
    this.resizeBorderLeft.addEventListener('mousedown', this.onDragStart(0b10000));
    this.resizeBorderRight.addEventListener('mousedown', this.onDragStart(0b01000));
    this.resizeBorderTop.addEventListener('mousedown', this.onDragStart(0b00100));
    this.resizeBorderBottom.addEventListener('mousedown', this.onDragStart(0b00010));
    this.resizeContainer.addEventListener('mousedown', this.onDragStart(0b00001));
    this.editor.getContainer().addEventListener('pointermove', this.onDragging);
    this.editor.getContainer().addEventListener('pointerup', this.onDragEnd);
  }

  render(rect: IRect) {
    this.update(rect);
    this.resizeContainer.appendChild(this.resizeBorderLeft);
    this.resizeContainer.appendChild(this.resizeBorderRight);
    this.resizeContainer.appendChild(this.resizeBorderTop);
    this.resizeContainer.appendChild(this.resizeBorderBottom);
    this.resizeContainer.appendChild(this.resizeAnchorLeftTop);
    this.resizeContainer.appendChild(this.resizeAnchorLeftBottom);
    this.resizeContainer.appendChild(this.resizeAnchorRightTop);
    this.resizeContainer.appendChild(this.resizeAnchorRightBottom);
    this.container.appendChild(this.resizeContainer);
  }

  // eslint-disable-next-line
  addResizeListener(listener: (event: any, nextRect: IRect) => void) {
    this.resizeListeners = this.resizeListeners.concat(listener);
  }

  // eslint-disable-next-line
  removeResizeListener(listener: (event: any, nextRect: IRect) => void) {
    this.resizeListeners = this.resizeListeners.filter(lastListener => lastListener !== listener);
  }

  // eslint-disable-next-line
  addResizeEndListener(listener: (event: any, nextRect: IRect) => void) {
    this.resizeEndListeners = this.resizeEndListeners.concat(listener);
  }

  // eslint-disable-next-line
  removeResizeEndListener(listener: (event: any, nextRect: IRect) => void) {
    this.resizeEndListeners = this.resizeEndListeners.filter(lastListener => lastListener !== listener);
  }

  release() {
    this.editor.getContainer().removeEventListener('pointermove', this.onDragging);
    this.editor.getContainer().removeEventListener('pointerup', this.onDragEnd);
    this.container.removeChild(this.resizeContainer);
  }

  private update(rect: IRect) {
    this.resizeContainer.style.left = rect.x + 'px';
    this.resizeContainer.style.top = rect.y + 'px';
    this.resizeContainer.style.width = rect.width + 'px';
    this.resizeContainer.style.height = rect.height + 'px';
    this.rect = Object.assign({}, rect);
  }

  private onDragStart = (resizeMode: number) => (event: MouseEvent) => {
    this.isDragging = true;
    this.resizeMode = resizeMode;
    this.startPoint = { x: event.clientX, y: event.clientY };
    this.startRect = Object.assign({}, this.rect);
    event.stopPropagation();
  };

  private onDragging = (event: MouseEvent) => {
    if (this.isDragging && event) {
      const currentPoint = { x: event.clientX, y: event.clientY };
      const nextRect = this.computeRect(currentPoint);
      this.update(nextRect);
      this.resizeListeners.forEach(listener => listener.call(null, event, nextRect));
    }
    event.stopPropagation();
  };

  private onDragEnd = (event: MouseEvent) => {
    if (this.isDragging && event) {
      const currentPoint = { x: event.clientX, y: event.clientY };
      const nextRect = this.computeRect(currentPoint);
      this.update(nextRect);
      this.resizeEndListeners.forEach(listener => listener.call(null, event, nextRect));
      this.isDragging = false;
    }
    event.stopPropagation();
  };

  private computeRect(point: IPointLike) {
    const nextRect = Object.assign({}, this.startRect);
    // left
    if (this.resizeMode & 0b10000) {
      nextRect.width = Math.max(this.startRect.width + (this.startPoint.x - point.x), minResizeWidth);
      nextRect.x = this.startRect.x + this.startRect.width - nextRect.width;
    }
    // right
    if (this.resizeMode & 0b01000) {
      nextRect.x = this.startRect.x;
      nextRect.width = Math.max(this.startRect.width + (point.x - this.startPoint.x), minResizeWidth);
    }
    // top
    if (this.resizeMode & 0b00100) {
      nextRect.height = Math.max(this.startRect.height + (this.startPoint.y - point.y), minResizeHeight);
      nextRect.y = this.startRect.y + this.startRect.height - nextRect.height;
    }
    // bottom
    if (this.resizeMode & 0b00010) {
      nextRect.y = this.startRect.y;
      nextRect.height = Math.max(this.startRect.height + (point.y - this.startPoint.y), minResizeHeight);
    }
    // move
    if (this.resizeMode & 0b00001) {
      nextRect.x = this.startRect.x + (point.x - this.startPoint.x);
      nextRect.y = this.startRect.y + (point.y - this.startPoint.y);
    }
    return nextRect;
  }
}
