import Animations from "./animations.js";
import UIElement from "./ui-elements/ui-element.js";

export default class Cellphone extends UIElement {
  constructor(options) {
    super(options);
    this.name = "cellphone";
    this.spriteData = getSprite("cellphone"); // Should this be defined in UIElement instead?

    const { initial } = this;
    initial.offset = vec2(900, 680);
    this.final.offset = vec2(900, 180);

    initial.opacity = 0.8;
    this.final.opacity = 1;
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
      this.setFadeOnHover();
    });
  }

  /**
   * Slide Up From Bottom
   * @override
   */
  playOpenAnimation() {
    Animations.SlideVertical(
      this.gameObj,
      this.initial.offset.y,
      this.final.offset.y,
      0.5,
    );
  }

  /**
   * Slide Down From Top
   * @override
   */
  async playCloseAnimation() {
    await Animations.SlideVertical(
      this.gameObj,
      this.gameObj.pos.y,
      this.initial.offset.y,
      0.5,
    );
  }
}
