
const fs = require("fs");
const path = require("path");

module.exports = function (eleventyConfig) {
  const pathPrefix = '/blog/';
  
  eleventyConfig.addGlobalData('pathPrefix', pathPrefix);

    const pluginRss = require("@11ty/eleventy-plugin-rss");
    eleventyConfig.addPlugin(pluginRss);
    
  eleventyConfig.addCollection("posts", collection =>
    collection.getFilteredByGlob("content/blog/posts/post*/**/*.njk")
  );

  /*  Static assets, etc.  */
  eleventyConfig.addPassthroughCopy("assets/**/*");
  eleventyConfig.addPassthroughCopy("layouts/*");

  eleventyConfig.addPassthroughCopy("content/gallery/images/*");
  eleventyConfig.addPassthroughCopy("content/about/*");

  // Dynamically passthrough post images and preserve URL structure
  const postsDir = "./content/blog/posts";

  fs.readdirSync(postsDir).forEach(postDir => {
    const imageSrc = path.join(postsDir, postDir, "images");
    if (fs.existsSync(imageSrc)) {
      const imageDest = path.join("blog/posts", postDir, "images");
      eleventyConfig.addPassthroughCopy({ [imageSrc]: imageDest });
    }
  });

  return {
    dir: {
      input: "content",      // project root
      output: "_site", // build folder
      includes: "../layouts"
    },
    pathPrefix: pathPrefix, // URL prefix for the site
  };
};
