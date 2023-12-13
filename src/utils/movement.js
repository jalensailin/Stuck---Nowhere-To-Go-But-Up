import KeyUtils from "./keys.js";

export default class MovementUtils {
  /**
   * Apply four-way movement to an entity.
   * @param {Object} entity - this is a member of some class,
   *                     which has entity.movementVector,
   *                     entity.speed AND entity.gameObj
   * @param {Object} keys - set of up/down/right/left keys
   */
  static fourWayMovement(entity, keys) {
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
}
