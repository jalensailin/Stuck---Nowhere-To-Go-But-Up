import AnimUtils from "../utils/animation.js";
import KeyUtils from "../utils/keys.js";
import STUCK from "../config.js";

export default class Player {
  constructor(spriteName) {
    this.sprite = spriteName;
    this.speed = 100;
    this.direction = "down";
    this.directionVector = vec2(0, 0);
    this.gameObj = null; // Game object will get defined on initialization.
  }

  initialize(parentObj, position) {
    // Add and set the game object.
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

  /**
   * Credit to Luiz Bills for inspiration on this movement function.
   */
  setMovement() {
    const { keys } = STUCK.controls;

    onUpdate(() => {
      const vel = {
        x: 0,
        y: 0,
      };
      // Check if keys are down and assign velocity components accordingly.
      if (KeyUtils.areKeysDown(keys.up)) {
        vel.y -= 1;
      }
      if (KeyUtils.areKeysDown(keys.down)) {
        vel.y += 1;
      }
      if (KeyUtils.areKeysDown(keys.right)) {
        vel.x += 1;
      }
      if (KeyUtils.areKeysDown(keys.left)) {
        vel.x -= 1;
      }
      this.directionVector = vec2(vel.x, vel.y);
      if (!this.directionVector.isZero()) {
        const velocity = this.directionVector.unit().scale(this.speed); // unit() to fix diagonal movement
        this.gameObj.move(velocity);
      }
    });

    // Change Animations on key down.
    onKeyDown((key) => {
      const { gameObj } = this;
      if (keys.left.includes(key)) {
        AnimUtils.playAnim(gameObj, "green-idle-left");
        this.direction = "left";
      }

      if (keys.right.includes(key)) {
        AnimUtils.playAnim(gameObj, "green-idle-right");
        this.direction = "right";
      }
      if (keys.up.includes(key)) {
        AnimUtils.playAnim(gameObj, "green-idle-up");
        this.direction = "up";
      }
      if (keys.down.includes(key)) {
        AnimUtils.playAnim(gameObj, "green-idle-down");
        this.direction = "down";
      }
    });
  }
}
