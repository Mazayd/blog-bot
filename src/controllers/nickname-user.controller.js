const { CommonView } = require('../view/common-views');
const { Keyboards } = require('../keyboards/keyboard');
const { NicknameUserView } = require('../view/nickname-user-view');

class NicknameUserController {
	#userServices;
	#postServices;
	#commentServices;
	#commonView;
	#nickNameUserView;
	#keyboards;
	constructor(UserServices, PostServices, CommentServices) {
		this.#userServices = UserServices;
		this.#postServices = PostServices;
		this.#commentServices = CommentServices;
		this.#commonView = new CommonView(UserServices, PostServices, CommentServices);
		this.#nickNameUserView = new NicknameUserView(UserServices, PostServices, CommentServices);
		this.#keyboards = new Keyboards();
	}

	async getUserByNickname(ctx) {
		if (ctx.message.text === ctx.i18n.t('buttons.back')) {
			this.#commonView.getAnotherUser(ctx);
		} else if (ctx.message.text === ctx.i18n.t('buttons.mainMenu')) {
			this.#commonView.mainMenu(ctx);
		} else if (ctx.message.text === ctx.session.user.nickName) {
			this.#commonView.userPost(ctx);
		} else {
			const user = await this.#userServices.getUserByNickName(ctx.message.text);
			if (!user) {
				return this.#commonView.nicknameNotFoundMessage(ctx);
			}
			ctx.session.user = user;
			this.#nickNameUserView.processUserByNickname(ctx, user);
		}
	}

	async processUserByNickname(ctx) {
		if (ctx.message.text === ctx.i18n.t('buttons.back')) {
			this.#nickNameUserView.getUserByNickname(ctx);
		} else if (ctx.message.text === ctx.i18n.t('buttons.mainMenu')) {
			this.#commonView.mainMenu(ctx);
		} else if (ctx.message.text === ctx.i18n.t('buttons.getPostAnotherUser')) {
			ctx.session.post_iterator = 0;
			const post = await this.#postServices.getPostById(ctx.session.user.posts[0]);

			if (!post) {
				return this.#commonView.notAnotherPost(ctx);
			}

			ctx.session.post = post;
			this.#nickNameUserView.getUserPostByNickname(ctx, post);
		}
	}

	async getUserPostByNickname(ctx) {
		if (ctx.message.text === ctx.i18n.t('buttons.back')) {
			this.#nickNameUserView.processUserByNickname(ctx, ctx.session.user);
		} else if (ctx.message.text === ctx.i18n.t('buttons.mainMenu')) {
			this.#commonView.mainMenu(ctx);
		} else if (ctx.message.text === ctx.i18n.t('buttons.writeComment')) {
			this.#nickNameUserView.writeUserCommentByNickname(ctx);
		} else if (ctx.message.text === ctx.i18n.t('buttons.getComments')) {
			ctx.session.comment_iterator = 0;
			const comment = await this.#commentServices.getCommentById(ctx.session.post.comments[0]);

			if (!comment) {
				return this.#commonView.notComment(ctx);
			}

			ctx.session.comment = comment;
			const author = await this.#userServices.getUserById(comment.user);
			this.#nickNameUserView.getUserCommentByNickname(ctx, comment, author);
		}
	}

	async getUserCommentByNickname(ctx) {
		if (ctx.message.text === ctx.i18n.t('buttons.back')) {
			this.#nickNameUserView.getUserPostByNickname(ctx, ctx.session.post);
		} else if (ctx.message.text === ctx.i18n.t('buttons.mainMenu')) {
			this.#commonView.mainMenu(ctx);
		}
	}

	async deleteUserCommentByNickname(ctx) {
		if (ctx.message.text === ctx.i18n.t('buttons.no')) {
			const author = await this.#userServices.getUserById(ctx.session.comment.user);
			this.#nickNameUserView.getUserCommentByNickname(ctx, ctx.session.comment, author);
		} else if (ctx.message.text === ctx.i18n.t('buttons.yes')) {
			const deleteComment = await this.#commentServices.deleteComment(ctx.from.id, ctx.session.comment._id);

			if (!deleteComment) {
				return ctx.reply(ctx.i18n.t('phrases.notDelete'));
			}

			const post = await this.#postServices.getPostById(deleteComment.post);
			ctx.session.post = post;

			ctx.reply(ctx.i18n.t('phrases.successfulyDeleteComment'));
			this.#nickNameUserView.getUserPostByNickname(ctx, ctx.session.post);
		}
	}

	async writeUserCommentByNickname(ctx) {
		if (ctx.message.text === ctx.i18n.t('buttons.back')) {
			this.#nickNameUserView.getUserPostByNickname(ctx, ctx.session.post);
		} else if (ctx.message.text === ctx.i18n.t('buttons.mainMenu')) {
			this.#commonView.mainMenu(ctx);
		} else {
			await this.#commentServices.newComment(ctx.from.id, ctx.session.post._id, {
				content: ctx.message.text,
			});
			const post = await this.#postServices.getPostById(ctx.session.post._id);
			ctx.session.post = post;
			ctx.reply(ctx.i18n.t('phrases.commentCreated'));
			this.#nickNameUserView.getUserPostByNickname(ctx, ctx.session.post);
		}
	}
}

module.exports = {
	NicknameUserController,
};
