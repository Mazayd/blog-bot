function createLikeButton(liked) {
  return {
    text: liked ? "❤️" : "🖤",
    callback_data: liked ? "❤️" : "🖤",
  };
}

function createNavigationButtons(iterator, totalData) {
  return [
    {
      text: "⏪",
      callback_data: `${parseInt(iterator) - 1}`,
    },
    {
      text: `${parseInt(iterator) + 1} c ${totalData}`,
      callback_data: `${parseInt(iterator)}`,
    },
    {
      text: "⏩",
      callback_data: `${parseInt(iterator) + 1}`,
    },
  ];
}

function createDeleteButton() {
  return {
    text: "🗑",
    callback_data: "🗑",
  };
}

module.exports = {
  createLikeButton,
  createNavigationButtons,
  createDeleteButton,
};
