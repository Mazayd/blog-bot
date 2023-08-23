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
}

module.exports = {
  Keyboards,
};
