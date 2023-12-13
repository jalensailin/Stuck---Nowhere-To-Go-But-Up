import KeyUtils from "./keys.js";
import AnimUtils from "./animation.js";

export default class MovementUtils {
  /**
   * Apply four-way movement to an entity.
   * @param {Object} entity - this is a member of some class,
   *                     which has entity.movementVector,
   *                     entity.speed AND entity.gameObj
   * @param {Object} keys - set of up/down/right/left keys
   * @param {String} animName - optional: name of movement animation, if any
   * @returns {Array<EventController>} - array of listeners invoked in this function.
   */
  static fourWayMovement(entity, keys, animName) {
    const listeners = [];
    if (animName) {
      const handleAnimation = this.handleFourWayAnimation(
        entity,
        keys,
        animName,
      );
      listeners.push(...handleAnimation);
    }

    listeners.push(this.handleFourWayMovement(entity, keys));
    return listeners;
  }

  /**
   * Handle moving an object in four directions (and diagonals).
   *
   * @param {Object} entity - this is a member of some class,
   *                     which has entity.movementVector,
   *                     entity.speed AND entity.gameObj
   * @param {Object} keys - set of up/down/right/left keys
   * @returns {Array<EventController>} - array of listeners invoked in this function.
   */
  static handleFourWayMovement(entity, keys) {
    return onUpdate(() => {
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
      entity.movementVector = vec2(vel.x, vel.y);
      if (!entity.movementVector.isZero()) {
        const velocity = entity.movementVector.unit().scale(entity.speed); // unit() to fix diagonal movement
        entity.gameObj.move(velocity);
      }
    });
  }

  /**
   * Handle animating sprites in 4 directions.
   *
   * @param {Object} entity - this is a member of some class,
   *                     which has entity.movementVector,
   *                     entity.speed AND entity.gameObj
   * @param {Object} keys - set of up/down/right/left keys
   * @param {String} animName - name of movement animation
   * @returns {Array<EventController>} - array of listeners invoked in this function.
   */
  static handleFourWayAnimation(entity, keys, animName) {
    // Change directon on key down.
    const keyDownListener = onKeyDown((key) => {
      for (const [direction, directionKeys] of Object.entries(keys)) {
        if (directionKeys.includes(key)) {
          entity.direction = direction;
          return;
        }
      }
    });

    // Update animation based on entity.direction.
    const onUpdateListener = onUpdate(() => {
      // If our movementVector isZero and we are currently animating, stop animation.
      if (entity.movementVector.isZero() && entity.gameObj.curAnim()) {
        entity.gameObj.stop(); // Stop the animation
      }
      AnimUtils.playAnim(entity.gameObj, `${animName}-${entity.direction}`);
    });

    return [keyDownListener, onUpdateListener];
  }
}
