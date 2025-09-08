/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `Epitome`,
    siteUrl: `https://www.yourdomain.tld`,
  },
  plugins: [
    "gatsby-plugin-postcss",

    // Image optimization
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",

    // Video optimization
    {
      resolve: "gatsby-transformer-ffmpeg",
      options: {
        // Video processing options
        formats: ["mp4", "webm"],
        maxWidth: 1920,
        quality: 80,
      },
    },

    // Performance optimizations
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "Epitome",
        short_name: "Epitome",
        start_url: "/",
        background_color: "#000000",
        theme_color: "#ffffff",
        display: "standalone",
        icon: "static/images/logomark_w.svg", // Path to your icon
      },
    },

    // Font optimization
    "gatsby-plugin-preload-fonts",

    // Bundle analysis (dev only)
    ...(process.env.NODE_ENV === "development"
      ? ["gatsby-plugin-webpack-bundle-analyser-v2"]
      : []),
  ],
};
