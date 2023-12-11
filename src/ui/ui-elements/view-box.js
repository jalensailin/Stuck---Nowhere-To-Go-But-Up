import UIElement from "./ui-element.js";

export default class ViewBox extends UIElement {
  constructor(spriteName, options) {
    super(options);
    this.name = "viewBox";
    this.spriteData = getSprite(spriteName); // Should this be defined in UIElement instead?

    const { initial } = this;
    // Any hard coded value here could instead be defined in options if we find ourselves changing it a lot.
    initial.scale = vec2(2);
    initial.offset = vec2(12, 0);
    initial.opacity = 0.7;
    initial.height = 0.1; // Start sandwiched
    initial.width = this.spriteData.data.width * initial.scale.x;

    this.final.height = this.spriteData.data.height * initial.scale.y; // End at full height.
  }

  /**
   * Render the View Sprite Box.
   *
   * @param {GameObj} parentObject
   */
  initialize(parentObject) {
    super.initialize(parentObject);
    this.setHoverBehavior();
  }

  /**
   * Override: Assembles components for building the game object.
   *
   * @param {*} parentObject
   * @override
   * @returns {CompList}
   */
  getComponents(parentObject) {
    const parentComponents = super.getComponents(parentObject);
    const { initial } = this;
    const spriteComponent = sprite(parentObject.name, {
      width: initial.width,
      height: initial.height,
    });
    return [...parentComponents, spriteComponent, area(), timer()];
  }

  /**
   * Slide Open From Top
   * @override
   */
  playOpenAnimation() {
    this.gameObj.tween(
      this.initial.height,
      this.final.height,
      0.5,
      (val) => {
        this.gameObj.height = val;
      },
      easings.easeInOutSine,
    );
  }

  /**
   * Slide Closed From Bottom
   * @override
   */
  async playCloseAnimation() {
    const currentHeight = this.gameObj.height;
    await this.gameObj.tween(
      currentHeight,
      this.initial.height,
      0.5 * (currentHeight / this.final.height),
      (val) => {
        this.gameObj.height = val;
      },
      easings.easeInOutSine,
    );
  }

  /**
   * Full opacity when mouse hovers.
   * Note: Events get cancelled when the game object they are made from is destroyed.
   */
  setHoverBehavior() {
    const { gameObj } = this;
    gameObj.onHover(() => {
      tween(
        gameObj.opacity,
        1,
        0.2,
        (val) => {
          gameObj.opacity = val;
        },
        easings.linear,
      );
    });

    gameObj.onHoverEnd(() => {
      tween(
        gameObj.opacity,
        0.7,
        0.2,
        (val) => {
          gameObj.opacity = val;
        },
        easings.linear,
      );
    });
  }
}