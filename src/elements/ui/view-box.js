import Animations from "../animations.js";
import GameElement from "../game-element.js";

export default class ViewBox extends GameElement {
  constructor(spriteName, options) {
    super("viewBox", spriteName, options || { scale: vec2(2) });

    const { initial } = this;
    // Any hard coded value here could instead be defined in options if we find ourselves changing it a lot.
    initial.offset = vec2(12, 0);
    initial.opacity = 0.7;
    initial.height = 0.1; // Start sandwiched
  }

  /**
   * Render the View Sprite Box.
   *
   * @param {GameObj} parentObject
   */
  initialize(parentObject) {
    // The name of the sprite should be the parent object's name.
    super.initialize(parentObject, { spriteName: parentObject.name });
    this.setFadeOnHover();
  }

  /**
   * Override: Assembles components for building the game object.
   *
   * @param {Object} options
   * @param {String} options.spriteName
   * @override
   * @returns {CompList}
   */
  getComponents({ spriteName } = {}) {
    const parentComponents = super.getComponents();
    const { initial } = this;
    const spriteComponent = sprite(spriteName, {
      width: initial.width,
      height: initial.height,
    });
    return [...parentComponents, spriteComponent, area()];
  }

  /**
   * Slide Open From Top
   * @override
   */
  playOpenAnimation() {
    Animations.Stretch(
      this.gameObj,
      this.initial.height,
      this.final.height,
      0.5,
    );
  }

  /**
   * Slide Closed From Bottom
   * @override
   */
  async playCloseAnimation() {
    const currentHeight = this.gameObj.height;
    await Animations.Stretch(
      this.gameObj,
      currentHeight,
      this.initial.height,
      0.5 * (currentHeight / this.final.height),
    );
  }
}
