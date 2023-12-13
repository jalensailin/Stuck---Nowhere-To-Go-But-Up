export default class Application {
  constructor(name) {
    this.name = name;

    // Create a list of listeners that can be created/cancelled when app is open/closed
    this.listeners = [];
  }

  /**
   * Start the app and create associated listeners.
   */
  async start() {
    await this.startAnimation();
    this.setApplicationListeners();
  }

  /**
   * Close the app and cancel associated listeners.
   */
  async close() {
    this.listeners.forEach((listener) => listener.cancel());
    await this.closeAnimation();
  }

  /**
   * Override this for individual apps.
   */
  startAnimation() {
    // Override this for individual apps.
  }

  /**
   * Override this for individual apps.
   */
  closeAnimation() {
    // Override this for individual apps.
  }

  /**
   * Override this for individual apps.
   */
  setApplicationListeners() {}
}
