const { Keyboards } = require("../keyboards/keyboard");

class View {
  #userServices;
  #postServices;
  #commentServices;
  #keyboards;
  constructor(UserServices, PostServices, CommentServices) {
    this.#userServices = UserServices;
    this.#postServices = PostServices;
    this.#commentServices = CommentServices;
    this.#keyboards = new Keyboards();
  }

  async firstChoiceNicknameView(ctx) {
    ctx.reply(ctx.i18n.t("phrases.firstChoiceNickname"));
    ctx.scene.enter("firstChoiceNickname");
  }

  async busyNickname(ctx) {
    ctx.reply(ctx.i18n.t("phrases.busyNickname"));
    ctx.scene.enter("firstChoiceNickname");
  }

  async firstChoiceAgeView(ctx) {
    ctx.reply(ctx.i18n.t("phrases.firstChoiceAge"));
    ctx.scene.enter("firstChoiceAge");
  }

  async firstChoiceSexView(ctx) {
    ctx.reply(
      ctx.i18n.t("phrases.firstChoiceSex"),
      this.#keyboards.choiceSex(ctx)
    );
    ctx.scene.enter("firstChoiceSex");
  }

  async mainMenu(ctx) {
    const user = await this.#userServices.getUserByTgId(ctx.from.id);
    ctx.session.user = user;
    const userData = ctx.i18n
      .t("phrases.userData")
      .replace("$telegramId", user.telegramId)
      .replace("$userName", user.name)
      .replace("$userNickname", user.nickName)
      .replace("$userAge", user.age)
      .replace("$userSex", user.sex);
    ctx.reply(
      `${ctx.i18n.t("phrases.mainMenu")}\n\n${userData}`,
      this.#keyboards.mainMenu(ctx)
    );
    ctx.scene.enter("mainMenu");
  }

  async userSetting(ctx) {
    ctx.reply(
      ctx.i18n.t("phrases.userSetting"),
      this.#keyboards.userSetting(ctx)
    );
    ctx.scene.enter("userSetting");
  }

  async userSettingName(ctx) {
    ctx.reply(
      ctx.i18n.t("phrases.userSettingName"),
      this.#keyboards.backAndMainMenu(ctx)
    );
    ctx.scene.enter("userSettingName");
  }

  async newUserName(ctx, name) {
    ctx.reply(
      ctx.i18n.t("phrases.newUserName").replace("$userName", name),
      this.#keyboards.backAndMainMenu(ctx)
    );
  }

  async userSettingNickname(ctx) {
    ctx.reply(
      ctx.i18n.t("phrases.userSettingNickname"),
      this.#keyboards.backAndMainMenu(ctx)
    );
    ctx.scene.enter("userSettingNickname");
  }

  async nicknameTaken(ctx) {
    ctx.reply(
      ctx.i18n.t("phrases.busyNickname"),
      this.#keyboards.backAndMainMenu(ctx)
    );
  }

  async newNickname(ctx, nickname) {
    ctx.reply(
      ctx.i18n.t("phrases.newUserNickname").replace("$userNickname", nickname),
      this.#keyboards.backAndMainMenu(ctx)
    );
  }

  async userSettingAge(ctx) {
    ctx.reply(
      ctx.i18n.t("phrases.userSettingAge"),
      this.#keyboards.backAndMainMenu(ctx)
    );
    ctx.scene.enter("userSettingAge");
  }

  async enterNumber(ctx) {
    ctx.reply(
      ctx.i18n.t("phrases.enterNumber"),
      this.#keyboards.backAndMainMenu(ctx)
    );
  }

  async newAge(ctx, age) {
    ctx.reply(
      ctx.i18n.t("phrases.newUserAge").replace("$userAge", age),
      this.#keyboards.backAndMainMenu(ctx)
    );
  }

  async userSettingSex(ctx) {
    ctx.reply(
      ctx.i18n.t("phrases.userSettingSex"),
      this.#keyboards.userSettingSex(ctx)
    );
    ctx.scene.enter("userSettingSex");
  }

  async newSex(ctx, sex) {
    ctx.reply(ctx.i18n.t("phrases.newUserSex").replace("$userSex", sex));
  }

  async userPost(ctx) {
    ctx.reply(ctx.i18n.t("phrases.userPost"), this.#keyboards.userPost(ctx));
    ctx.scene.enter("userPost");
  }

  async newPost(ctx) {
    ctx.reply(
      ctx.i18n.t("phrases.newPost"),
      this.#keyboards.backAndMainMenu(ctx)
    );
    ctx.scene.enter("newPost");
  }

  async choosingHashtag(ctx) {
    ctx.reply(
      ctx.i18n.t("phrases.choosingHashtag"),
      this.#keyboards.choosingHashtag(ctx)
    );
    ctx.scene.enter("choosingHashtag");
  }

  async postCreated(ctx, post) {
    let message = ctx.i18n
      .t("phrases.postCreated")
      .replace("$content", post.content)
      .replace(
        "$dateCreate",
        new Date(post.dateOfCreation).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      );

    if (post.hashtags.length === 0) {
      message = message.replace("$hashtags", "Отсутствуют");
    } else {
      message = message.replace("$hashtags", post.hashtags[0]);
    }
    ctx.reply(message, this.#keyboards.userPost(ctx));
    ctx.scene.enter("userPost");
  }

  async getMyPost(ctx, post) {
    let message = ctx.i18n
      .t("phrases.post")
      .replace("$content", post.content)
      .replace("$likes", post.numberOfLikes)
      .replace("$comment", post.comments.length)
      .replace(
        "$dateCreate",
        new Date(post.dateOfCreation).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      );
    if (post.hashtags.length === 0) {
      message = message.replace("$hashtags", "Отсутствуют");
    } else {
      message = message.replace("$hashtags", `${post.hashtags.join(", ")}`);
    }
    ctx.reply(ctx.i18n.t("phrases.getPost"), this.#keyboards.getMyPost(ctx));
    if (ctx.session.user.posts.length > 1) {
      ctx
        .reply(message, {
          reply_markup: this.#keyboards.myPostInline(ctx),
        })
        .then((sentMessage) => {
          const message_id = sentMessage.message_id;
          ctx.deleteMessage(ctx.session.message_id);
          ctx.session.message_id = message_id;
        });
    } else {
      ctx.reply(message).then((sentMessage) => {
        const message_id = sentMessage.message_id;
        ctx.deleteMessage(ctx.session.message_id);
        ctx.session.message_id = message_id;
      });
    }
    ctx.scene.enter("getMyPost");
  }

  changeOfPost(ctx, post) {
    let message = ctx.i18n
      .t("phrases.post")
      .replace("$content", post.content)
      .replace("$likes", post.numberOfLikes)
      .replace("$comment", post.comments.length)
      .replace(
        "$dateCreate",
        new Date(post.dateOfCreation).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      );
    if (post.hashtags.length === 0) {
      message = message.replace("$hashtags", "Отсутствуют");
    } else {
      message = message.replace("$hashtags", `${post.hashtags.join(", ")}`);
    }
    ctx.editMessageText(message, {
      reply_markup: this.#keyboards.myPostInline(ctx),
    });
  }

  notPost(ctx) {
    ctx.reply(ctx.i18n.t("phrases.notPost"));
  }

  getComments(ctx, comment, author) {
    const message = ctx.i18n
      .t("phrases.comment")
      .replace("$content", comment.content)
      .replace("$likes", comment.numberOfLikes)
      .replace("$author", author.nickName)
      .replace(
        "$dateCreate",
        new Date(comment.dateOfCreate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      );
    ctx.reply(
      ctx.i18n.t("phrases.getComment"),
      this.#keyboards.getMyComment(ctx)
    );
    if (ctx.session.post.comments.length > 1) {
      ctx
        .reply(message, {
          reply_markup: this.#keyboards.myCommentInline(ctx),
        })
        .then((sentMessage) => {
          ctx.deleteMessage(ctx.session.message_id);
          ctx.session.message_id = sentMessage.message_id;
        });
    } else {
      ctx.reply(message).then((sentMessage) => {
        const message_id = sentMessage.message_id;
        ctx.deleteMessage(ctx.session.message_id);
        ctx.session.message_id = message_id;
      });
    }

    ctx.scene.enter("getUserPostComment");
  }

  changeOfComment(ctx, comment, author) {
    const message = ctx.i18n
      .t("phrases.comment")
      .replace("$content", comment.content)
      .replace("$likes", comment.numberOfLikes)
      .replace("$author", author.nickName)
      .replace(
        "$dateCreate",
        new Date(comment.dateOfCreate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      );
    ctx.editMessageText(message, {
      reply_markup: this.#keyboards.myCommentInline(ctx),
    });
  }

  notComment(ctx) {
    ctx.reply(ctx.i18n.t("phrases.notComment"));
  }

  updatePost(ctx) {
    ctx.reply(
      ctx.i18n.t("phrases.updatePost"),
      this.#keyboards.backAndMainMenu(ctx)
    );
    ctx.scene.enter("updatePost");
  }

  deletePost(ctx) {
    ctx.reply(
      ctx.i18n.t("phrases.deletePost"),
      this.#keyboards.deletePost(ctx)
    );
    ctx.scene.enter("deletePost");
  }

  successfullyRemoved(ctx) {
    ctx.reply(
      ctx.i18n.t("phrases.successfullyRemoved"),
      this.#keyboards.userPost(ctx)
    );
    ctx.scene.enter("userPost");
  }

  updateHashtag(ctx) {
    if (ctx.session.post.hashtags.length === 0) {
      ctx.reply(
        ctx.i18n.t("phrases.updateHashtag"),
        this.#keyboards.updateHashtagNoHashtag(ctx)
      );
    } else {
      ctx.reply(
        ctx.i18n.t("phrases.updateHashtag"),
        this.#keyboards.updateHashtag(ctx)
      );
    }
    ctx.scene.enter("updateHashtag");
  }

  deleteHashtag(ctx) {
    ctx.reply(
      ctx.i18n.t("phrases.deleteHashtag"),
      this.#keyboards.deletePost(ctx)
    );
    ctx.scene.enter("deleteHashtag");
  }

  deleteComment(ctx) {
    ctx.reply(
      ctx.i18n.t("phrases.deleteComment"),
      this.#keyboards.deletePost(ctx)
    );
    ctx.scene.enter("deleteComment");
  }
}

module.exports = {
  View,
};
