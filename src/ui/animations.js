export default class Animations {
  /**
   * Fade in or out.
   *
   * @param {GameObj} gameObj
   * @param {Number} initial
   * @param {Number} final
   * @param {Number} duration
   * @returns
   */
  static async Fade(gameObj, initial, final, duration) {
    return gameObj.tween(
      initial,
      final,
      duration,
      (val) => {
        gameObj.opacity = val;
      },
      easings.linear,
    );
  }

  /**
   * Slide Up or Down.
   *
   * @param {GameObj} gameObj
   * @param {Number} initial
   * @param {Number} final
   * @param {Number} duration
   * @returns
   */
  static async SlideVertical(gameObj, initial, final, duration) {
    return gameObj.tween(
      initial,
      final,
      duration,
      (val) => {
        gameObj.pos.y = val;
      },
      easings.easeInOutSine,
    );
  }

  /**
   * Slide in any direction. Notice, initial/final Values here are vec2's.
   *
   * @param {GameObj} gameObj
   * @param {vec2} initial
   * @param {vec2} final
   * @param {Number} duration
   * @returns
   */
  static async Slide(gameObj, initial, final, duration) {
    return gameObj.tween(
      initial,
      final,
      duration,
      (val) => {
        gameObj.pos = val;
      },
      easings.easeInOutSine,
    );
  }

  /**
   * Stretch open or closed.
   *
   * @param {GameObj} gameObj
   * @param {Number} initial
   * @param {Number} final
   * @param {Number} duration
   * @returns
   */
  static async Stretch(gameObj, initial, final, duration) {
    return gameObj.tween(
      initial,
      final,
      duration,
      (val) => {
        gameObj.height = val;
      },
      easings.easeInOutSine,
    );
  }

  /**
   * Camera Follows a Subject.
   *
   * @param {GameObj} gameObj
   * @param {Number} duration
   * @returns
   */
  static async CameraFollow(gameObj, duration) {
    return tween(
      camPos(), // initial position
      gameObj.worldPos(), // target position
      duration,
      // Callback function called every frame.
      // Argument is a position between initial and target - what to do when updating.
      (newPos) => {
        camPos(newPos);
      },
      easings.linear, // easing function to use
    );
  }
}
