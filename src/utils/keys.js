export default class KeyUtils {
  /**
   * Check if any in an array of keys is down.
   *
   * @param {Array} keys
   */
  static areKeysDown(keys) {
    for (const key of keys) {
      if (isKeyDown(key)) return true;
    }
    return false;
  }
}
