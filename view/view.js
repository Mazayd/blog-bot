const { Keyboards } = require("../src/keyboards/keyboard");

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
}

module.exports = {
  View,
};
