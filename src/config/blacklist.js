const blacklist = new Set();

module.exports = {
  addToken: (token) => {
    blacklist.add(token);
  },
  isTokenBlacklisted: (token) => {
    return blacklist.has(token);
  },
};