import AnimUtils from "../utils/animation.js";
import STUCK from "../config.js";
import MovementUtils from "../utils/movement.js";

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
    MovementUtils.fourWayMovement(this, keys);

    onKeyRelease((key) => {
      // Early return if not directional keys
      if (!Object.values(keys).flat().includes(key)) return;

      const currentAnim = this.gameObj.curAnim();

      // If quickly releasing two keys, I think there is a split second where
      // the first key releases, which stops the animation, then this event
      // fires again, before a new animation can be set, thus curAnim() is false.
      // We check to avoid errors.
      if (!currentAnim) return;

      this.gameObj.stop(); // Stop the animation

      // Reset animation to idle.
      const sprite = getSprite(this.sprite);
      const anim = sprite.data.anims[currentAnim];
      this.gameObj.frame = anim.from;
    });

    onUpdate(() => {
      if (this.movementVector.isZero()) return;
      switch (this.direction) {
        case "up":
          AnimUtils.playAnim(this.gameObj, "green-up");
          break;
        case "down":
          AnimUtils.playAnim(this.gameObj, "green-down");
          break;
        case "left":
          AnimUtils.playAnim(this.gameObj, "green-left");
          break;
        case "right":
          AnimUtils.playAnim(this.gameObj, "green-right");
          break;
        default:
          break;
      }
    });

    // Change Animations on key down.
    onKeyDown((key) => {
      if (keys.left.includes(key)) {
        this.direction = "left";
      }

      if (keys.right.includes(key)) {
        this.direction = "right";
      }
      if (keys.up.includes(key)) {
        this.direction = "up";
      }
      if (keys.down.includes(key)) {
        this.direction = "down";
      }
    });
  }
}
