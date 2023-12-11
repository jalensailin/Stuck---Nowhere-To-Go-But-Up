import Camera from "./camera.js";

export default class SubjectCamera extends Camera {
  constructor(subject, { scale = 1, rotation = 0 } = {}) {
    super({ scale, rotation });
    this.subject = subject;
    this.follow = true;
  }

  initialize() {
    super.initialize();
    this.followSubject();
  }

  followSubject() {
    // Update loop that is run every frame.
    onUpdate(() => {
      if (!this.follow) return;
      // TODO: figure out what this conditional is doing
      if (this.subject.gameObj.pos.dist(camPos())) {
        // If we want the tween to finish before moving on with logic, use `await`
        tween(
          camPos(), // initial position
          this.subject.gameObj.worldPos(), // target position
          0.05, // how fast do we want the values to change
          // Callback function called every frame.
          // Argument is a position between initial and target - what to do when updating.
          (newPos) => {
            camPos(newPos);
          },
          easings.linear, // easing function to use
        );
      }
    });
  }
}
