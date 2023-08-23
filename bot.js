const ApiIntegrationServices = require("blog-api-lib");
const dotenv = require("dotenv");
const { Telegraf, Stage, session, BaseScene } = require("telegraf");
const I18n = require("telegraf-i18n");
const path = require("path");
const {
  DefaultActionController,
} = require("./src/controllers/default-actions.controller");
const {
  ChoiceNicknameController,
} = require("./src/controllers/choice-nickname.controller");

const i18n = new I18n({
  directory: path.join(__dirname, "src/locales"),
  defaultLanguage: "ru",
  useSession: true,
  defaultLanguageOnMissing: false,
});

dotenv.config();

(async function () {
  const API = new ApiIntegrationServices(
    process.env.API_URL || "http://localhost:3000"
  );
  const UserServices = API.getUserServices();
  const PostServices = API.getPostServices();
  const CommentServices = API.getCommentServices();

  const defaultActionController = new DefaultActionController(
    UserServices,
    PostServices,
    CommentServices
  );
  const choiceNicknameController = new ChoiceNicknameController(
    UserServices,
    PostServices,
    CommentServices
  );

  const bot = new Telegraf(process.env.BOT_TOKEN || "");

  const stage = new Stage();

  bot.use(session());
  bot.use(i18n.middleware());
  bot.use(async (ctx, next) => {
    if (!ctx.session.__language) {
      ctx.session.__language = "ru";
      ctx.i18n.locale("ru");
    }
    return next();
  });

  const mainMenu = new BaseScene("mainMenu");
  stage.register(mainMenu);

  const firstChoiceNickname = new BaseScene("firstChoiceNickname");
  stage.register(firstChoiceNickname);

  bot.use(stage.middleware());

  bot.catch(console.log);

  bot.start(
    defaultActionController.noScenesReply.bind(defaultActionController)
  );

  firstChoiceNickname.on(
    "text",
    choiceNicknameController.firstChoiceNickname.bind(choiceNicknameController)
  );

  bot.launch();

  return "Sam";
})()
  .then((result) => {
    console.log(`Bot started ${result || 1}`);
  })
  .catch((err) => {
    console.log(err);
  });
