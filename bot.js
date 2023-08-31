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
const {
  GetAnotherUserController,
} = require("./src/controllers/get-another-user.controller");

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
  const getAnotherUserController = new GetAnotherUserController(
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
  const getUserPostComment = new BaseScene("getUserPostComment");
  stage.register(getUserPostComment);
  const updatePost = new BaseScene("updatePost");
  stage.register(updatePost);
  const deletePost = new BaseScene("deletePost");
  stage.register(deletePost);
  const updateHashtag = new BaseScene("updateHashtag");
  stage.register(updateHashtag);
  const deleteHashtag = new BaseScene("deleteHashtag");
  stage.register(deleteHashtag);
  const deleteComment = new BaseScene("deleteComment");
  stage.register(deleteComment);
  const writeComment = new BaseScene("writeComment");
  stage.register(writeComment);

  const getAnotherUser = new BaseScene("getAnotherUser");
  stage.register(getAnotherUser);
  const getUserByNickname = new BaseScene("getUserByNickname");
  stage.register(getUserByNickname);
  const processUserByNickname = new BaseScene("processUserByNickname");
  stage.register(processUserByNickname);
  const getAnotherUserPost = new BaseScene("getAnotherUserPost");
  stage.register(getAnotherUserPost);
  const getAnotherUserComment = new BaseScene("getAnotherUserComment");
  stage.register(getAnotherUserComment);
  const deleteAnotherUserPostComment = new BaseScene(
    "deleteAnotherUserPostComment"
  );
  stage.register(deleteAnotherUserPostComment);
  const writeCommentAnotherUser = new BaseScene("writeCommentAnotherUser");
  stage.register(writeCommentAnotherUser);

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
  newPost.command(
    "user_setting",
    menusController.userSettingView.bind(menusController)
  );
  newPost.on("text", userPostController.newPost.bind(userPostController));
  choosingHashtag.start(
    defaultActionController.startReply.bind(defaultActionController)
  );
  choosingHashtag.on(
    "text",
    userPostController.choosingHashtag.bind(userPostController)
  );

  getMyPost.start(
    defaultActionController.startReply.bind(defaultActionController)
  );
  getMyPost.command(
    "user_setting",
    menusController.userSettingView.bind(menusController)
  );
  getMyPost.on("text", userPostController.getMyPost.bind(userPostController));
  getMyPost.on(
    "callback_query",
    userPostController.getMyPostInline.bind(userPostController)
  );

  updatePost.start(
    defaultActionController.startReply.bind(defaultActionController)
  );
  updatePost.command(
    "user_setting",
    menusController.userSettingView.bind(menusController)
  );
  updatePost.on("text", userPostController.updatePost.bind(userPostController));

  deletePost.start(
    defaultActionController.startReply.bind(defaultActionController)
  );
  deletePost.command(
    "user_setting",
    menusController.userSettingView.bind(menusController)
  );
  deletePost.on("text", userPostController.deletePost.bind(userPostController));

  updateHashtag.start(
    defaultActionController.startReply.bind(defaultActionController)
  );
  updateHashtag.command(
    "user_setting",
    menusController.userSettingView.bind(menusController)
  );
  updateHashtag.on(
    "text",
    userPostController.updateHashtag.bind(userPostController)
  );

  deleteHashtag.start(
    defaultActionController.startReply.bind(defaultActionController)
  );
  deleteHashtag.command(
    "user_setting",
    menusController.userSettingView.bind(menusController)
  );
  deleteHashtag.on(
    "text",
    userPostController.deleteHashtag.bind(userPostController)
  );

  getUserPostComment.start(
    defaultActionController.startReply.bind(defaultActionController)
  );
  getUserPostComment.command(
    "user_setting",
    menusController.userSettingView.bind(menusController)
  );
  getUserPostComment.on(
    "text",
    userPostController.getUserPostComment.bind(userPostController)
  );
  getUserPostComment.on(
    "callback_query",
    userPostController.inlineComment.bind(userPostController)
  );

  deleteComment.start(
    defaultActionController.startReply.bind(defaultActionController)
  );
  deleteComment.command(
    "user_setting",
    menusController.userSettingView.bind(menusController)
  );
  deleteComment.on(
    "text",
    userPostController.deleteComment.bind(userPostController)
  );

  writeComment.start(
    defaultActionController.startReply.bind(defaultActionController)
  );
  writeComment.command(
    "user_setting",
    menusController.userSettingView.bind(menusController)
  );
  writeComment.on(
    "text",
    userPostController.writeComment.bind(userPostController)
  );

  getAnotherUser.start(
    defaultActionController.startReply.bind(defaultActionController)
  );
  getAnotherUser.command(
    "user_setting",
    menusController.userSettingView.bind(menusController)
  );
  getAnotherUser.on(
    "text",
    getAnotherUserController.getAnotherUser.bind(getAnotherUserController)
  );

  getUserByNickname.start(
    defaultActionController.startReply.bind(defaultActionController)
  );
  getUserByNickname.command(
    "user_setting",
    menusController.userSettingView.bind(menusController)
  );
  getUserByNickname.on(
    "text",
    getAnotherUserController.getUserByNickname.bind(getAnotherUserController)
  );

  processUserByNickname.start(
    defaultActionController.startReply.bind(defaultActionController)
  );
  processUserByNickname.command(
    "user_setting",
    menusController.userSettingView.bind(menusController)
  );
  processUserByNickname.on(
    "text",
    getAnotherUserController.processUserByNickname.bind(
      getAnotherUserController
    )
  );

  getAnotherUserPost.start(
    defaultActionController.startReply.bind(defaultActionController)
  );
  getAnotherUserPost.command(
    "user_setting",
    menusController.userSettingView.bind(menusController)
  );
  getAnotherUserPost.on(
    "text",
    getAnotherUserController.getAnotherUserPost.bind(getAnotherUserController)
  );
  getAnotherUserPost.on(
    "callback_query",
    getAnotherUserController.getPostInline.bind(getAnotherUserController)
  );

  getAnotherUserComment.start(
    defaultActionController.startReply.bind(defaultActionController)
  );
  getAnotherUserComment.command(
    "user_setting",
    menusController.userSettingView.bind(menusController)
  );
  getAnotherUserComment.on(
    "text",
    getAnotherUserController.getAnotherUserComment.bind(
      getAnotherUserController
    )
  );
  getAnotherUserComment.on(
    "callback_query",
    userPostController.inlineComment.bind(userPostController)
  );

  deleteAnotherUserPostComment.start(
    defaultActionController.startReply.bind(defaultActionController)
  );
  deleteAnotherUserPostComment.command(
    "user_setting",
    menusController.userSettingView.bind(menusController)
  );
  deleteAnotherUserPostComment.on(
    "text",
    getAnotherUserController.deleteAnotherUserPostComment.bind(
      getAnotherUserController
    )
  );

  writeCommentAnotherUser.on(
    "text",
    getAnotherUserController.writeCommentAnotherUser.bind(
      getAnotherUserController
    )
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
