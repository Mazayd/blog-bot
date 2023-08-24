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
}

module.exports = {
  View,
};
