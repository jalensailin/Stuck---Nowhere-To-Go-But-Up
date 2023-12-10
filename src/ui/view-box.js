export default class ViewBox {
  constructor(spriteName) {
    this.spriteData = getSprite(spriteName);
    this.gameObj = null;
  }

  initialize(parentObject) {
    const { spriteData } = this;
    this.gameObj = parentObject.add([
      sprite(parentObject.name, {
        width: spriteData.data.width * 2,
        height: 1,
      }),
      pos(12, 0),
      opacity(0.7),
      area(),
      timer(),
      "viewBox",
      {
        viewBox: this,
      },
    ]);
    this.playOpenAnimation();
    this.setHoverBehavior();
  }

  async destroy() {
    await this.playCloseAnimation();
    this.gameObj.destroy();
  }

  playOpenAnimation() {
    this.gameObj.tween(
      1,
      this.spriteData.data.height * 2,
      0.5,
      (val) => {
        this.gameObj.height = val;
      },
      easings.easeInOutSine,
    );
  }

  async playCloseAnimation() {
    await this.gameObj.tween(
      this.gameObj.height,
      1,
      0.5 * (this.gameObj.height / (this.spriteData.data.height * 2)),
      (val) => {
        this.gameObj.height = val;
      },
      easings.easeInOutSine,
    );
  }

  // Events get cancelled when the game object they are made from is destroyed.
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
