import Application from "./application.js";

export default class MessagesApp extends Application {
  constructor() {
    super("messages", "messages-icon");
    this.initial.offset = vec2(90, 34);
  }

  start() {
    super.start();
    const { Cellphone } = StuckGame;
    const message = Cellphone.screenSpace.add([
      pos(75, 25),
      rect(150, 60, { radius: 10 }),
      color(74, 160, 217),
      opacity(),
      timer(),
    ]);
    message.add([
      pos(-5, 5),
      text("This is a test. This is another test", {
        size: 12,
        width: message.width - 5,
        align: "right",
      }),
      color(0, 0, 0),
      opacity(),
      timer(),
    ]);

    const message2 = Cellphone.screenSpace.add([
      pos(15, 95),
      rect(150, 60, { radius: 10 }),
      color(117, 217, 50),
      opacity(),
      timer(),
    ]);
    message2.add([
      pos(-5, 5),
      text("This is a test. This is another test", {
        size: 12,
        width: message2.width - 5,
        align: "right",
      }),
      color(0, 0, 0),
      opacity(),
      timer(),
    ]);
  }

  setApplicationListeners() {}
}
