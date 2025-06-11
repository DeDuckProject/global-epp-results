// This file is run before each test file.
// It extends the vitest expect assertion with jest-dom matchers.
import '@testing-library/jest-dom';
import 'vitest-canvas-mock';

// JSDOM doesn't implement PointerEvent so we need to polyfill it.
// https://github.com/radix-ui/primitives/issues/1822
// https://github.com/jsdom/jsdom/pull/2666
if (typeof window !== 'undefined' && !window.PointerEvent) {
  class PointerEvent extends MouseEvent {
    public pointerId?: number;
    public pressure?: number;
    public tangentialPressure?: number;
    public tiltX?: number;
    public tiltY?: number;
    public twist?: number;
    public width?: number;
    public height?: number;
    public pointerType?: string;
    public isPrimary?: boolean;

    constructor(type: string, params: PointerEventInit = {}) {
      super(type, params);
      this.pointerId = params.pointerId;
      this.pressure = params.pressure;
      this.tangentialPressure = params.tangentialPressure;
      this.tiltX = params.tiltX;
      this.tiltY = params.tiltY;
      this.twist = params.twist;
      this.width = params.width;
      this.height = params.height;
      this.pointerType = params.pointerType;
      this.isPrimary = params.isPrimary;
    }
  }
  window.PointerEvent = PointerEvent as any;
}

// Polyfill for ResizeObserver
if (typeof window !== 'undefined' && !window.ResizeObserver) {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserver;
} 