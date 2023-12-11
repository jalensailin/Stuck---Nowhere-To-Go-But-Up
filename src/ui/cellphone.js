import UIElement from "./ui-elements/ui-element.js";

export default class Cellphone extends UIElement {
  constructor(options) {
    super(options);
    this.name = "cellphone";
    this.spriteData = getSprite("cellphone"); // Should this be defined in UIElement instead?

    const { initial } = this;
    initial.offset = vec2(900, 680);
    this.final.offset = vec2(900, 180);
  }

  getComponents() {
    const parentComponents = super.getComponents();
    return [
      ...parentComponents,
      sprite("cellphone"),
      area(),
      fixed(),
      offscreen(),
    ];
  }

  /**
   * Set the listener for opening/closing (initializing/destroying)
   * the cellphone game object.
   *
   * @param {GameObj} parentObject
   */
  setPhoneListeners(parentObject) {
    onKeyPress("c", () => {
      if (this.gameObj) {
        this.destroy();
        return;
      }
      this.initialize(parentObject);
    });
  }

  /**
   * Slide Up From Bottom
   * @override
   */
  playOpenAnimation() {
    this.gameObj.tween(
      this.initial.offset.y,
      this.final.offset.y,
      0.5,
      (val) => {
        this.gameObj.pos.y = val;
      },
      easings.easeInOutSine,
    );
  }

  /**
   * Slide Down From Top
   * @override
   */
  async playCloseAnimation() {
    await this.gameObj.tween(
      this.gameObj.pos.y,
      this.initial.offset.y,
      0.5,
      (val) => {
        this.gameObj.pos.y = val;
      },
      easings.easeInOutSine,
    );
  }
}
