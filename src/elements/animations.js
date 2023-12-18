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
  static Fade(gameObj, initial, final, duration) {
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
   * Fade the children of provided game object.
   *
   * @param {GameObj} gameObj
   * @param {Number} initial
   * @param {Number} final
   * @param {Number} duration
   * @param {Array<String>} excludedNames - array of child tags to exclude
   * @returns
   */
  static FadeChildren(gameObj, initial, final, duration, excludedNames = []) {
    const allObjects = gameObj
      .get("*", { recursive: true })
      .filter((obj) => !excludedNames.includes(obj?.name));

    const anims = [];
    for (const object of allObjects) {
      anims.push(
        object.tween(
          initial,
          final,
          duration,
          (val) => {
            object.opacity = val;
          },
          easings.linear,
        ),
      );
    }
    return anims;
  }

  static Rotate(gameObj, initial, final, duration) {
    return gameObj.tween(
      initial,
      final,
      duration,
      (val) => {
        gameObj.angle = val;
      },
      easings.easeInOutSine,
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
  static SlideVertical(gameObj, initial, final, duration) {
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
  static Slide(gameObj, initial, final, duration) {
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
  static Stretch(gameObj, initial, final, duration) {
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
  static CameraFollow(gameObj, duration) {
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
