import type { IRect } from '../../typings/common';

// TODO: maybe refactor with vgrammar mark
export class ResizeController {
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

  constructor(container: HTMLElement) {
    this.container = container;
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
    this.resizeContainer = document.createElement('div');
    this.resizeContainer.classList.add('resize-container');

    this.resizeAnchorLeftTop = document.createElement('div');
    this.resizeAnchorLeftTop.classList.add('resize-anchor', 'resize-anchor-left-top');
    this.resizeAnchorLeftBottom = document.createElement('div');
    this.resizeAnchorLeftBottom.classList.add('resize-anchor', 'resize-anchor-left-Bottom');
    this.resizeAnchorRightTop = document.createElement('div');
    this.resizeAnchorRightTop.classList.add('resize-anchor', 'resize-anchor-right-top');
    this.resizeAnchorRightBottom = document.createElement('div');
    this.resizeAnchorRightBottom.classList.add('resize-anchor', 'resize-anchor-right-Bottom');

    this.resizeBorderLeft = document.createElement('div');
    this.resizeBorderLeft.classList.add('resize-border', 'resize-border-left');
    this.resizeBorderRight = document.createElement('div');
    this.resizeBorderRight.classList.add('resize-border', 'resize-border-right');
    this.resizeBorderTop = document.createElement('div');
    this.resizeBorderTop.classList.add('resize-border', 'resize-border-top');
    this.resizeBorderBottom = document.createElement('div');
    this.resizeBorderBottom.classList.add('resize-border', 'resize-border-bottom');

    this.container.appendChild(this.resizeContainer);
  }

  update(rect: IRect) {
    this.resizeContainer.style.left = rect.x + 'px';
    this.resizeContainer.style.top = rect.y + 'px';
    this.resizeContainer.style.width = rect.width + 'px';
    this.resizeContainer.style.height = rect.height + 'px';
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

  release() {
    this.container.removeChild(this.resizeContainer);
  }
}
