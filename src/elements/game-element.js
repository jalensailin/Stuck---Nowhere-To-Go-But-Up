import Animations from "./animations.js";

export default class GameElement {
  /**
   *
   * @param {String} name - name of this game element
   * @param {String} spriteName - name of this game element's sprite
   * @param {Object} options
   * @param {Number} options.initialWidth - Initial width, must provide if no sprite
   * @param {Number} options.initialHeight - Initial height, must provide if no sprite
   * @param {vec2}   [options.initialScale=vec2(1)] - Initial scale
   * @param {vec2}   [options.initialOffset=vec2(0)] - Initial offset from parent item.
   * @param {Number} [options.initialOpacity=1] - Initial opacity
   * @param {Number} options.finalWidth - Final width, must provide if no sprite
   * @param {Number} options.finalHeight - Final height, must provide if no sprite
   * @param {vec2}   options.finalScale - Final scale
   * @param {vec2}   options.finalOffset - Final offset from parent item.
   * @param {Number} options.finalOpacity - Final opacity
   */
  constructor(
    name,
    spriteName,
    {
      initialWidth,
      initialHeight,
      initialScale = vec2(1),
      initialOffset = vec2(0),
      initialOpacity = 1,
      finalWidth,
      finalHeight,
      finalScale,
      finalOffset,
      finalOpacity,
    } = {},
  ) {
    this.name = name;
    if (spriteName) {
      this.spriteName = spriteName;
      this.spriteData = getSprite(spriteName);
    }

    const spriteWidth = this.spriteData.data.width;
    const spriteHeight = this.spriteData.data.height;

    // Define initial animation values.
    this.initial = {
      width: (initialWidth || spriteWidth) * initialScale.x,
      height: (initialHeight || spriteHeight) * initialScale.y,
      scale: initialScale,
      offset: initialOffset,
      opacity: initialOpacity,
    };

    // Define final animation values (default same as initial).
    this.final = {
      // eslint-disable-next-line no-unsafe-optional-chaining
      width: finalWidth * finalScale?.x || this.initial.width,
      // eslint-disable-next-line no-unsafe-optional-chaining
      height: finalHeight * finalScale?.y || this.initial.height,
      scale: finalScale || this.initial.scale.clone(),
      offset: finalOffset || this.initial.offset.clone(),
      opacity: finalOpacity || this.initial.opacity,
    };

    this.gameObj = null;

    this.listeners = {
      onHover: null,
      onHoverEnd: null,
    };
  }

  /**
   * Render this Game Element.
   * May be overridden.
   *
   * @param {GameObj} parentObject
   * @param {Object} options - options that can customize this fxn's or getComponent's behavior
   */
  initialize(parentObject, options) {
    const componentList = this.getComponents(options);
    this.gameObj = parentObject.add(componentList);
    this.playOpenAnimation();
  }

  /**
   * Destroy this Game Element.
   * May be overridden.
   */
  async destroy() {
    await this.playCloseAnimation();
    this.gameObj.destroy();
    this.gameObj = null; // gameObj no longer exists, so lets reflect that.
  }

  /**
   * Assemble components for building this game object.
   * Should be overridden and supered.
   *
   * @returns {Array<GameComponent>}
   */
  getComponents() {
    const { initial } = this;
    return [
      sprite(this.spriteName),
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
   * Full opacity when mouse hovers and vice versa. Update this game obj and all children.
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
