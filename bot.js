const ApiIntegrationServices = require("blog-api-lib");
const dotenv = require("dotenv");
const { Telegraf, Stage, session, BaseScene } = require("telegraf");
const I18n = require("telegraf-i18n");
const path = require("path");
const {
  DefaultActionController,
} = require("./src/controllers/default-actions.controller");
const {
  RegisterController,
} = require("./src/controllers/choice-nickname.controller");
const { MenusController } = require("./src/controllers/menus.controller");
const {
  UserSettingController,
} = require("./src/controllers/user-setting.controler");
const {
  UserPostController,
} = require("./src/controllers/user-post.controller");

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
  const registerController = new RegisterController(
    UserServices,
    PostServices,
    CommentServices
  );
  const menusController = new MenusController(
    UserServices,
    PostServices,
    CommentServices
  );
  const userSettingController = new UserSettingController(
    UserServices,
    PostServices,
    CommentServices
  );
  const userPostController = new UserPostController(
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
  const firstChoiceAge = new BaseScene("firstChoiceAge");
  stage.register(firstChoiceAge);
  const firstChoiceSex = new BaseScene("firstChoiceSex");
  stage.register(firstChoiceSex);

  const userSetting = new BaseScene("userSetting");
  stage.register(userSetting);
  const userSettingName = new BaseScene("userSettingName");
  stage.register(userSettingName);
  const userSettingNickname = new BaseScene("userSettingNickname");
  stage.register(userSettingNickname);
  const userSettingAge = new BaseScene("userSettingAge");
  stage.register(userSettingAge);
  const userSettingSex = new BaseScene("userSettingSex");
  stage.register(userSettingSex);

  const userPost = new BaseScene("userPost");
  stage.register(userPost);
  const newPost = new BaseScene("newPost");
  stage.register(newPost);
  const choosingHashtag = new BaseScene("choosingHashtag");
  stage.register(choosingHashtag);
  const getMyPost = new BaseScene("getMyPost");
  stage.register(getMyPost);

  bot.use(stage.middleware());

  bot.catch(console.log);

  bot.start(defaultActionController.startReply.bind(defaultActionController));
  bot.help(menusController.helpView.bind(menusController));
  bot.command(
    "user_setting",
    menusController.userSettingView.bind(menusController)
  );
  bot.on(
    "text",
    defaultActionController.noSceneReply.bind(defaultActionController)
  );

  firstChoiceNickname.on(
    "text",
    registerController.firstChoiceNickname.bind(registerController)
  );
  firstChoiceAge.on(
    "text",
    registerController.firstChoiceAge.bind(registerController)
  );
  firstChoiceSex.on(
    "text",
    registerController.firstChoiceSex.bind(registerController)
  );

  mainMenu.start(
    defaultActionController.startReply.bind(defaultActionController)
  );
  mainMenu.help(menusController.helpView.bind(menusController));
  mainMenu.command(
    "user_setting",
    menusController.userSettingView.bind(menusController)
  );
  mainMenu.on("text", menusController.mainMenu.bind(menusController));

  userSetting.start(
    defaultActionController.startReply.bind(defaultActionController)
  );
  userSetting.command(
    "user_setting",
    menusController.userSettingView.bind(menusController)
  );
  userSetting.on(
    "text",
    userSettingController.userSetting.bind(userSettingController)
  );
  userSettingName.start(
    defaultActionController.startReply.bind(defaultActionController)
  );
  userSettingName.command(
    "user_setting",
    menusController.userSettingView.bind(menusController)
  );
  userSettingName.on(
    "text",
    userSettingController.userSettingName.bind(userSettingController)
  );
  userSettingNickname.start(
    defaultActionController.startReply.bind(defaultActionController)
  );
  userSettingNickname.command(
    "user_setting",
    menusController.userSettingView.bind(menusController)
  );
  userSettingNickname.on(
    "text",
    userSettingController.userSettingNickname.bind(userSettingController)
  );
  userSettingAge.start(
    defaultActionController.startReply.bind(defaultActionController)
  );
  userSettingAge.command(
    "user_setting",
    menusController.userSettingView.bind(menusController)
  );
  userSettingAge.on(
    "text",
    userSettingController.userSettingAge.bind(userSettingController)
  );
  userSettingSex.start(
    defaultActionController.startReply.bind(defaultActionController)
  );
  userSettingSex.command(
    "user_setting",
    menusController.userSettingView.bind(menusController)
  );
  userSettingSex.on(
    "text",
    userSettingController.userSettingSex.bind(userSettingController)
  );

  userPost.start(
    defaultActionController.startReply.bind(defaultActionController)
  );
  userPost.on("text", userPostController.userPost.bind(userPostController));
  newPost.start(
    defaultActionController.startReply.bind(defaultActionController)
  );
  newPost.on("text", userPostController.newPost.bind(userPostController));
  choosingHashtag.start(
    defaultActionController.startReply.bind(defaultActionController)
  );
  choosingHashtag.on(
    "text",
    userPostController.choosingHashtag.bind(userPostController)
  );
  getMyPost.on("text", userPostController.getMyPost.bind(userPostController));
  getMyPost.on(
    "callback_query",
    userPostController.getMyPostInline.bind(userPostController)
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
