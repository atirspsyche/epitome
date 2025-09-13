const path = require("path");

const motionBrands = require("./src/data/motion-data.json");
const stillBrands = require("./src/data/still-data.json");
const shortFilmBrands = require("./src/data/short-film-data.json");
const digitalFilmBrands = require("./src/data/digital-brand-data.json");
exports.createPages = async ({ actions }) => {
  const { createPage } = actions;
  const template = path.resolve("./src/templates/brand-template.js");
  const digitaTemplate = path.resolve(
    "./src/templates/brand-template-digital.js"
  );

  motionBrands.forEach((b) => {
    createPage({
      path: `/work/motion/${b.brand_name.replace(/\s+/g, "")}`,
      component: template,
      context: {
        ...b,
      },
    });
  });
  stillBrands.forEach((b) => {
    createPage({
      path: `/work/still/${b.brand_name.replace(/\s+/g, "")}`,
      component: template,
      context: {
        ...b,
      },
    });
  });
  shortFilmBrands.forEach((b) => {
    createPage({
      path: `/work/films/${b.brand_name.replace(/\s+/g, "")}`,
      component: template,
      context: {
        ...b,
      },
    });
  });
  digitalFilmBrands.forEach((b) => {
    createPage({
      path: `/work/digital/${b.brand_name.replace(/\s+/g, "")}`,
      component: digitaTemplate,
      context: {
        ...b,
      },
    });
  });
};
