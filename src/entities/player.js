import AnimUtils from "../utils/animation.js";

export default class Player {
  constructor(spriteName) {
    this.sprite = spriteName;
    this.speed = 100;
    this.direction = "down";
    this.gameObj = null;
  }

  initialize(parentObj, position) {
    this.gameObj = parentObj.add([
      // Create a sprite
      sprite(this.sprite, { width: 16, height: 16, anim: "green-idle-down" }),
      // Create a hitbox with a rectangular shape, offset by (3,4), with 10 width and 12 height
      area({ shape: new Rect(vec2(3, 4), 10, 12) }),
      // Body component tells kaboom to make object affected by physics
      body(),
      pos(position),
      opacity(),
      // Pass in strings which are interpreted as tags by which the entity can be identified later.
      "player",
    ]);
    this.setMovement();
  }

  setMovement() {
    onKeyDown((key) => {
      const upKeys = ["up", "w"];
      const leftKeys = ["left", "a"];
      const rightKeys = ["right", "d"];
      const downKeys = ["down", "s"];

      const { gameObj } = this;
      if (leftKeys.includes(key)) {
        AnimUtils.playAnim(gameObj, "green-idle-left");
        gameObj.move(-this.speed, 0); // Works with a game object that has area and body defined.
        this.direction = "left";
      }

      if (rightKeys.includes(key)) {
        AnimUtils.playAnim(gameObj, "green-idle-right");
        gameObj.move(this.speed, 0);
        this.direction = "right";
      }
      if (upKeys.includes(key)) {
        AnimUtils.playAnim(gameObj, "green-idle-up");
        gameObj.move(0, -this.speed);
        this.direction = "up";
      }
      if (downKeys.includes(key)) {
        AnimUtils.playAnim(gameObj, "green-idle-down");
        gameObj.move(0, this.speed);
        this.direction = "down";
      }
    });
  }
}
