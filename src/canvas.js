// eslint-disable-next-line import/no-unresolved
import kaboom from "https://unpkg.com/kaboom@3000.1.17/dist/kaboom.mjs";

/**
 * Singleton class which defines our canvas
 */
export default class Canvas {
  /**
   *
   * @param {Number} width
   * @param {Number} height
   */
  constructor(width, height) {
    this.height = height;
    this.width = width;
    this.scenes = null;
    this.player = null;
  }

  /**
   * Initialize Kaboom and draw the canvas.
   * @returns {KaboomInstance}
   */
  initialize() {
    return kaboom({
      width: this.width,
      height: this.height,
      letterbox: true,
    });
  }
}
