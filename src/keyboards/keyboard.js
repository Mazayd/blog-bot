const { Markup } = require("telegraf");
const i18n = require("i18n");

class Keyboards {
  mainMenu(ctx) {
    return Markup.keyboard([[]]);
  }
}

module.exports = {
  Keyboards,
};
