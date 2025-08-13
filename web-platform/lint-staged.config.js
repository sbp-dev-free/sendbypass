module.exports = {
  "**/*.(ts|tsx)": () => "yarn tsc --noEmit",

  "**/*.(ts|tsx|js)": (filenames) => {
    const files = filenames.map((f) => `"${f}"`).join(" ");
    return [`yarn eslint --fix ${files}`, `yarn prettier --write ${files}`];
  },

  "**/*.(md|json)": (filenames) => {
    const files = filenames.map((f) => `"${f}"`).join(" ");
    return `yarn prettier --write ${files}`;
  },
};
