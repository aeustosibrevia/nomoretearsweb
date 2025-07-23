const { slugify } = require('transliteration');

module.exports = (text) => {
    return slugify(text, { lowercase: true });
};
