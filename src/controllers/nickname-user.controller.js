const { View } = require('../view/view');
const { Keyboards } = require('../keyboards/keyboard');

class NicknameUserController {
	#userServices;
	#postServices;
	#commentServices;
	#view;
	#keyboards;
	constructor(UserServices, PostServices, CommentServices) {
		this.#userServices = UserServices;
		this.#postServices = PostServices;
		this.#commentServices = CommentServices;
		this.#view = new View(UserServices, PostServices, CommentServices);
		this.#keyboards = new Keyboards();
	}

	async getUserByNickname(ctx) {
		if (ctx.message.text === ctx.i18n.t('buttons.back')) {
			this.#view.getAnotherUser(ctx);
		} else if (ctx.message.text === ctx.i18n.t('buttons.mainMenu')) {
			this.#view.mainMenu(ctx);
		} else if (ctx.message.text === ctx.session.user.nickName) {
			this.#view.userPost(ctx);
		} else {
			const user = await this.#userServices.getUserByNickName(ctx.message.text);
			if (!user) {
				return this.#view.nicknameNotFoundMessage(ctx);
			}
			ctx.session.user = user;
			this.#view.processUserByNickname(ctx, user);
		}
	}

	async processUserByNickname(ctx) {
		if (ctx.message.text === ctx.i18n.t('buttons.back')) {
			this.#view.getUserByNickname(ctx);
		} else if (ctx.message.text === ctx.i18n.t('buttons.mainMenu')) {
			this.#view.mainMenu(ctx);
		} else if (ctx.message.text === ctx.i18n.t('buttons.getPostAnotherUser')) {
			ctx.session.post_iterator = 0;
			const post = await this.#postServices.getPostById(ctx.session.user.posts[0]);

			if (!post) {
				return this.#view.notAnotherPost(ctx);
			}

			ctx.session.post = post;
			this.#view.getAnotherUserPost(ctx, post);
		}
	}

	async getAnotherUserPost(ctx) {
		if (ctx.message.text === ctx.i18n.t('buttons.back')) {
			this.#view.processUserByNickname(ctx, ctx.session.user);
		} else if (ctx.message.text === ctx.i18n.t('buttons.mainMenu')) {
			this.#view.mainMenu(ctx);
		} else if (ctx.message.text === ctx.i18n.t('buttons.writeComment')) {
			this.#view.writeCommentAnotherUser(ctx);
		} else if (ctx.message.text === ctx.i18n.t('buttons.getComments')) {
			ctx.session.comment_iterator = 0;
			const comment = await this.#commentServices.getCommentById(ctx.session.post.comments[0]);

			if (!comment) {
				return this.#view.notComment(ctx);
			}

			ctx.session.comment = comment;
			const author = await this.#userServices.getUserById(comment.user);
			this.#view.getAnotherUserComment(ctx, comment, author);
		}
	}

	async getAnotherUserComment(ctx) {
		if (ctx.message.text === ctx.i18n.t('buttons.back')) {
			this.#view.getAnotherUserPost(ctx, ctx.session.post);
		} else if (ctx.message.text === ctx.i18n.t('buttons.mainMenu')) {
			this.#view.mainMenu(ctx);
		} else if (ctx.message.text === ctx.i18n.t('buttons.deleteComment')) {
			this.#view.deleteAnotherUserPostComment(ctx);
		}
	}

	async deleteAnotherUserPostComment(ctx) {
		if (ctx.message.text === ctx.i18n.t('buttons.no')) {
			const author = await this.#userServices.getUserById(ctx.session.comment.user);
			this.#view.getAnotherUserComment(ctx, ctx.session.comment, author);
		} else if (ctx.message.text === ctx.i18n.t('buttons.yes')) {
			const deleteComment = await this.#commentServices.deleteComment(ctx.from.id, ctx.session.comment._id);

			if (!deleteComment) {
				return ctx.reply(ctx.i18n.t('phrases.notDelete'));
			}

			const post = await this.#postServices.getPostById(deleteComment.post);
			ctx.session.post = post;

			ctx.reply(ctx.i18n.t('phrases.successfulyDeleteComment'));
			this.#view.getAnotherUserPost(ctx, ctx.session.post);
		}
	}

	async writeCommentAnotherUser(ctx) {
		if (ctx.message.text === ctx.i18n.t('buttons.back')) {
			this.#view.getAnotherUserPost(ctx, ctx.session.post);
		} else if (ctx.message.text === ctx.i18n.t('buttons.mainMenu')) {
			this.#view.mainMenu(ctx);
		} else {
			await this.#commentServices.newComment(ctx.from.id, ctx.session.post._id, {
				content: ctx.message.text,
			});
			const post = await this.#postServices.getPostById(ctx.session.post._id);
			ctx.session.post = post;
			ctx.reply(ctx.i18n.t('phrases.commentCreated'));
			this.#view.getAnotherUserPost(ctx, post);
		}
	}
}

module.exports = {
	NicknameUserController,
};
