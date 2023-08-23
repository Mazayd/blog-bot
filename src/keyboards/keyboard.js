const { Markup } = require("telegraf");
const i18n = require("i18n");

class Keyboards {
  mainMenu(ctx) {
    return Markup.keyboard([[ctx.i18n.t("buttons.userSetting")]])
      .resize()
      .extra();
  }

  choiceSex(ctx) {
    return Markup.keyboard([
      [ctx.i18n.t("buttons.men"), ctx.i18n.t("buttons.women")],
    ])
      .resize()
      .extra();
  }

  backAndMainMenu(ctx) {
    return Markup.keyboard([
      [ctx.i18n.t("buttons.mainMenu"), ctx.i18n.t("buttons.back")],
    ])
      .resize()
      .extra();
  }

  userSetting(ctx) {
    return Markup.keyboard([
      [ctx.i18n.t("buttons.back")],
      [ctx.i18n.t("buttons.userName"), ctx.i18n.t("buttons.userNickname")],
      [ctx.i18n.t("buttons.userAge"), ctx.i18n.t("buttons.userSex")],
    ])
      .resize()
      .extra();
  }
}

module.exports = {
  Keyboards,
};
