import STUCK from "../../config.js";
import MovementUtils from "../../utils/movement.js";

export default class Player {
  constructor(spriteName) {
    this.sprite = spriteName;
    this.speed = 100;
    this.direction = "down";
    this.movementVector = vec2(0, 0);
    this.gameObj = null; // Game object will get defined on initialization.
  }

  initialize(parentObj, position) {
    // Add and set the game object.
    this.gameObj = parentObj.add([
      // Create a sprite
      sprite(this.sprite, {
        width: 16,
        height: 16,
        anim: "green-down-idle",
        animSpeed: 0.6,
      }),
      // Create a hitbox with a rectangular shape, offset by (3,4), with 10 width and 12 height
      area({ shape: new Rect(vec2(3, 4), 10, 12) }),
      // Body component tells kaboom to make object affected by physics
      body(),
      pos(position),
      opacity(),
      // Pass in strings which are interpreted as tags by which the entity can be identified later.
      "player",
      {
        player: this,
      },
    ]);
    this.setMovement();
  }

  /**
   * Credit to Luiz Bills for inspiration on this movement function.
   */
  setMovement() {
    const keys = STUCK.controls.player;

    // Set up four way movement.
    MovementUtils.fourWayMovement(this, keys, "green");
  }
}
