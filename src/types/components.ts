export interface IToolbarComponent {
  key?: string;
  name?: string;
  visible?: boolean;
  className?: string;
  icon?: string;
  activeIcon?: string;
}

export interface IPosition {
  x: number;
  y: number;
}

export interface ICanvasComponent extends IToolbarComponent, IPosition {
  
}