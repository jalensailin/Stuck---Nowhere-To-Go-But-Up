import Animations from "../animations.js";

export default class UIElement {
  /**
   *
   * @param {Number} width - Initial width
   * @param {Number} height - Initial height
   * @param {vec2}   [scale=vec2(1)] - Initial scale
   * @param {vec2}   [offset=vec2(0)] - Initial offset from parent item.
   * @param {Number} [opacity=1] - Initial opacity
   */
  constructor({
    width,
    height,
    scale = vec2(1),
    offset = vec2(0),
    opacity = 1,
  } = {}) {
    this.name = "uiElement";

    // Define initial animation values.
    this.initial = {
      width: width * scale.x,
      height: height * scale.y,
      scale,
      offset,
      opacity,
    };

    // Define final animation values (default same as initial).
    this.final = {
      width: this.initial.width,
      height: this.initial.height,
      scale: this.initial.scale.clone(),
      offset: this.initial.offset.clone(),
      opacity: this.initial.opacity,
    };

    this.gameObj = null;

    this.listeners = {
      onHover: null,
      onHoverEnd: null,
    };
  }

  /**
   * Render this UI Element.
   * May be overridden.
   *
   * @param {GameObj} parentObject
   */
  initialize(parentObject) {
    const componentList = this.getComponents(parentObject);
    this.gameObj = parentObject.add(componentList);
    this.playOpenAnimation();
  }

  /**
   * Destroy this UI Element.
   * May be overridden.
   */
  async destroy() {
    await this.playCloseAnimation();
    this.gameObj.destroy();
    this.gameObj = null; // gameObj no longer exists, so lets reflect that.
  }

  /**
   * Assemble components for building this game object.
   * Should be overridden.
   */
  getComponents() {
    const { initial } = this;
    return [
      pos(initial.offset),
      opacity(initial.opacity),
      timer(),
      this.name,
      { [this.name]: this, name: this.name },
    ];
  }

  // eslint-disable-next-line class-methods-use-this
  playOpenAnimation() {
    // Does nothing as-is. Should be overridden.
  }

  // eslint-disable-next-line class-methods-use-this
  async playCloseAnimation() {
    // Does nothing as-is. Should be overridden.
  }

  /**
   * Full opacity when mouse hovers.
   * Note: Events get cancelled when the game object they are made from is destroyed.
   *
   * @param {Object} [options={}]
   * @param {boolean} [options.recursive=true] - apply hover to all child objects
   * @param {Array<String>} [options.excludedNames=[]] - exclude child object by name
   */
  setFadeOnHover({ recursive = true, excludedNames = [] } = {}) {
    const thisGameObj = this.gameObj;
    const childGameObjs = thisGameObj.get("*", { recursive });

    // This game object and its children, excluding specified names.
    const allGameObjs = childGameObjs
      .concat(thisGameObj)
      .filter((gameObj) => !excludedNames.includes(gameObj.name));

    this.listeners.onHover = thisGameObj.onHover(() => {
      for (const gameObj of allGameObjs) {
        const finalOpacity = gameObj[gameObj.name].final.opacity;
        Animations.Fade(gameObj, gameObj.opacity, finalOpacity, 0.2);
      }
    });

    this.listeners.onHoverEnd = thisGameObj.onHoverEnd(() => {
      for (const gameObj of allGameObjs) {
        const initialOpacity = gameObj[gameObj.name].initial.opacity;
        Animations.Fade(gameObj, gameObj.opacity, initialOpacity, 0.2);
      }
    });
  }
}
