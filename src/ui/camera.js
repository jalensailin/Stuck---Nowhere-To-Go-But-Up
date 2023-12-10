export default class Camera {
  constructor(
    { scale = 1, position = vec2(0, 0), rotation = 0 } = {},
    subject = null,
  ) {
    this.subject = subject;
    this.scale = scale;
    this.rotation = rotation;
    this.position = position;
  }

  initialize() {
    const gameObj = this.subject?.gameObj;
    // If we have a subject, position the camera on it.
    const position = this.subject ? gameObj.worldPos() : this.position;
    camScale(this.scale); // Scale the camera.
    camRot(this.rotation); // Rotate the camera.
    camPos(position); // Position the camera on our subject.
    this.followSubject();
  }

  followSubject() {
    // Update loop that is run every frame.
    onUpdate(() => {
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
