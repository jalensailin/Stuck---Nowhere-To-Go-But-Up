import Animations from "../../animations.js";
import Application from "./application.js";

export default class MessagesApp extends Application {
  constructor() {
    super("messages", "messages-icon");
    this.initial.offset = vec2(90, 34);

    this.messageMask = null;
    this.messageSpace = null;
    this.previewSpace = null;

    this.currentChat = "none";
    this.chats = {
      friend1: [
        {
          message: "Hey! Long time no talk. I miss uuu. How have things been?",
          contact: true,
        },
        {
          message: "Hey that's sweet of you to reach out. i miss you too",
          contact: false,
        },
        { message: "Things are okay with me. What about you?", contact: false },
        {
          message:
            "Just okay...? is ther eanything wrong? Im always here to talk",
          contact: true,
        },
        { message: "there**", contact: true },
        {
          message:
            "Yeah... I've just been feeling down lately. Haven't really been going out or doing much of anything",
          contact: false,
        },
        {
          message:
            "Yeah... I've just been feeling down lately. Haven't really been going out or doing much of anything",
          contact: false,
        },
        {
          message:
            "Yeah... I've just been feeling down lately. Haven't really been going out or doing much of anything",
          contact: false,
        },
      ],
      friend2: [
        {
          message: "Hey! Long time no talk. I miss uuu. How have things been?",
          contact: true,
        },
      ],
    };
  }

  /**
   * Start this app.
   * @override
   */
  async start() {
    this.generateMessageMask();
    if (this.currentChat === "none") {
      this.generateMessagePreviews();
    } else {
      this.generateMessages();
    }
    await super.start();
  }

  /**
   * Generate game objects for the messages.
   * @override
   */
  async close() {
    await super.close();
    this.messageMask.destroy();
    this.previewSpace = null;
    this.messageMask = null;
    this.messageSpace = null;
  }

  /**
   * Fade messages in.
   * @override
   */
  startAnimation() {
    super.startAnimation();
    const currentObject =
      this.currentChat === "none" ? this.previewSpace : this.messageSpace;
    return Animations.FadeChildren(currentObject, 0, 0.85, 0.3);
  }

  /**
   * Fade messages out.
   * @override
   */
  async closeAnimation() {
    const currentObject =
      this.currentChat === "none" ? this.previewSpace : this.messageSpace;
    await Animations.FadeChildren(currentObject, 0.85, 0, 0.3);
    return super.closeAnimation();
  }

  /**
   * Set scroll behavior and other listeners.
   * @override
   */
  setApplicationListeners() {
    if (this.currentChat === "none") {
      this.setPreviewsListeners();
      return;
    }
    this.setChatListeners();
  }

  /**
   * Set Chat listeners. These get destroyed when the messageSpace is destroyed.
   */
  setChatListeners() {
    // Set chat scroll listeners.
    const { messageSpace } = this;
    messageSpace.onScroll((vector) => {
      if (
        vector.y > 0 &&
        -messageSpace.totalHeight -
          (messageSpace.pos.y - this.messageMask.height) <=
          this.messageMask.height
      )
        return;
      if (vector.y < 0 && messageSpace.pos.y <= this.messageMask.height) return; // Don't scroll below most recent message.
      messageSpace.pos.y += vector.y / 2;
    });

    // Return to chat previews.
    messageSpace.onMousePress("right", async () => {
      this.currentChat = "none";
      this.generateMessagePreviews();
      // Fade the message-space out.
      Animations.FadeChildren(this.messageSpace, 0.85, 0, 0.3);
      // Destroy the preview space and set to null;
      this.messageSpace.destroy();
      this.messageSpace = null;
      // Fade previews in.
      await Animations.FadeChildren(this.previewSpace, 0, 0.85, 0.3);
      this.setPreviewsListeners();
    });
  }

  /**
   * Set Chat Previews listeners. These get destroyed when the previewSpace is destroyed.
   */
  setPreviewsListeners() {
    const chatPreviews = get("chatPreview", { recursive: true });
    chatPreviews.forEach((preview) =>
      preview.onClick(() => {
        this.currentChat = preview.contact; // Update the current chat.
        // Generate the messages based on the current chat.
        this.generateMessages();
        // Fade the preview-space out.
        Animations.FadeChildren(this.previewSpace, 0.85, 0, 0.3);
        // Destroy the preview space and set to null;
        this.previewSpace.destroy();
        this.previewSpace = null;
        // Fade messages in.
        Animations.FadeChildren(this.messageSpace, 0, 0.85, 0.3);
        this.setChatListeners();
      }),
    );
  }

  /**
   * Generate the mask which will contain all other game objects in this app,
   * and keep them confined to the correct space.
   */
  generateMessageMask() {
    const { Cellphone } = StuckGame;
    // Message mask defines the area on the screen that our messages takes up.
    this.messageMask = Cellphone.screenSpace.add([
      pos(0, Cellphone.infoBar.height), // Position bottom left corner of info bar.
      // Fill the screen under the info bar
      rect(
        Cellphone.screenSpace.width,
        Cellphone.screenSpace.height - Cellphone.infoBar.height,
      ),
      mask(), // Only render within this rectangle.
      "messageMask",
      { name: "messageMask" },
    ]);
  }

  /**
   * Generate the game objects which show
   */
  generateMessagePreviews() {
    const { Cellphone } = StuckGame;
    this.previewSpace = this.messageMask.add([pos(0, 0)]);

    // Add Messages bar
    const msgBar = this.previewSpace.add([
      rect(Cellphone.screenSpace.width, 25, { fill: false }),
      opacity(0),
      timer(),
    ]);
    // Header text
    msgBar.add([
      pos(msgBar.width / 2, msgBar.height / 2),
      text("Messages", { size: 16 }),
      color(0, 0, 0),
      anchor("center"),
      opacity(0),
      timer(),
    ]);
    // Horizontal rule.
    msgBar.add([
      pos(0, msgBar.height),
      rect(Cellphone.screenSpace.width, 1),
      opacity(0),
      timer(),
    ]);

    // Iterate through each chat/contact and create spaces for them.
    const chatList = Object.entries(this.chats);
    chatList.forEach(([contact, messages], index) => {
      const positionY = msgBar.height + index * 50;
      // Container holding each chat.
      const chatPreview = this.previewSpace.add([
        pos(0, positionY),
        rect(Cellphone.screenSpace.width, 50, { fill: false }),
        area(),
        opacity(0),
        timer(),
        "chatPreview",
        { contact },
      ]);

      // Contact's name
      chatPreview.add([
        pos(50, 5),
        text(contact, { size: 15 }),
        color(0, 0, 0),
        opacity(0),
        timer(),
      ]);

      // Display most recent message from a contact.
      const recentMessage = messages
        .toReversed()
        .find((msg) => msg.contact).message;
      chatPreview.add([
        pos(55, 22),
        text(recentMessage, {
          size: 11,
          width: Cellphone.screenSpace.width - 55,
          height: 50 - 25,
        }),
        color(88, 88, 88),
        opacity(0),
        timer(),
      ]);

      // Horizontal rule
      this.previewSpace.add([
        pos(50, positionY + 50),
        rect(Cellphone.screenSpace.width - 50, 1),
        opacity(0),
        timer(),
      ]);
    });
  }

  /**
   * Generate the game objects for a particular group of messages.
   */
  generateMessages() {
    if (this.currentChat === "none") return;

    const { Cellphone } = StuckGame;

    // messageSpace contains each chat message and moves up/down on scroll.
    this.messageSpace = this.messageMask.add([
      pos(0, Cellphone.screenSpace.height - Cellphone.infoBar.height),
      "messageSpace",
      { name: "messageSpace", totalHeight: 0 },
    ]);
    // List of messages to display.
    const messageList = this.chats[this.currentChat].toReversed();

    // The y-position of each message bubble is dependent on the total heights of previous ones.
    let positionY = 0;
    // Iterate over each message and create message bubble/text game objects.
    messageList.forEach((message, index) => {
      const msgColor = message.contact ? rgb(117, 217, 50) : rgb(74, 160, 217);
      // The x-position relies on where each message came from (not dependent on other messages).
      const positionX = message.contact ? 15 : 75;
      const textData = {
        text: message.message,
        size: 12,
        width: 140,
      };
      const textInfo = formatText(textData);
      if (index === 0) {
        // 12px border around the bubble + 15px buffer from bottom of screen.
        positionY -= textInfo.height + 27;
      } else {
        // 12px border around the bubble, + 10px buffer from last message.
        positionY -= textInfo.height + 22;
      }
      const msg = this.messageSpace.add([
        pos(positionX, positionY),
        rect(textInfo.width + 10, textInfo.height + 12, { radius: 10 }),
        color(msgColor),
        opacity(0),
        timer(),
        "messageBubble",
        { name: "messageBubble" },
      ]);
      msg.add([
        pos(6, 6),
        text(textData.text, {
          size: textData.size,
          width: textData.width - 10,
        }),
        color(0, 0, 0),
        opacity(0),
        timer(),
        "messageText",
        { name: "messageText" },
      ]);
    });
    this.messageSpace.totalHeight = positionY;
  }
}
