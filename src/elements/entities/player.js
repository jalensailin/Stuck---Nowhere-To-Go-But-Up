import STUCK from "../../config.js";
import MovementUtils from "../../utils/movement.js";
import GameElement from "../game-element.js";

export default class Player extends GameElement {
  constructor(spriteName, options) {
    super("player", spriteName, options);
    this.speed = 100;
    this.direction = "down";
    this.movementVector = vec2(0, 0);
    this.gameObj = null; // Game object will get defined on initialization.
  }

  /**
   * Spawn the player somewhere.
   * We override this function (without calling the super)
   *
   * @override
   * @param {GameObj} parentObj - The map on which to spawn this entity.
   * @param {Object} options - Options customizing init behavior.
   * @param {Vec2} options.spawnPoint - Where to spawn this entity.
   */
  initialize(parentObj, options) {
    super.initialize(parentObj, options);
    this.setMovement();
  }

  /**
   *
   * @param {Object} options - Options customizing init behavior.
   * @param {Vec2} options.spawnPoint - Where to spawn this entity.
   * @returns {Array<GameComponent>}
   */
  getComponents({ spawnPoint } = {}) {
    const parentComponents = super.getComponents();
    return [
      ...parentComponents,
      // Create a sprite
      sprite(this.spriteName, {
        width: 16,
        height: 16,
        anim: "green-down-idle",
        animSpeed: 0.6,
      }),
      // Create a hitbox with a rectangular shape, offset by (3,4), with 10 width and 12 height
      area({ shape: new Rect(vec2(3, 4), 10, 12) }),
      // Body component tells kaboom to make object affected by physics
      body(),
      pos(spawnPoint),
      opacity(),
    ];
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
