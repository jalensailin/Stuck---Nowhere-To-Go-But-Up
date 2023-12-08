export default class AnimUtils {
  /**
   * Only play the animation if it's not already playing.
   *
   * @param {GameObj} gameObj
   * @param {String} animationName
   */
  static playAnim(gameObj, animationName) {
    if (gameObj.curAnim() !== animationName) gameObj.play(animationName); // Function to play animations in Kaboom.
  }
}
