import { validateSection } from "../../_config/section-schema.js";

// Homepage sections are collection members only: they are composed into
// content/index.njk and never written as standalone pages. The
// eleventyDataSchema callback fails the build on an unknown section type
// or missing required front matter. (Default export ONLY - named exports
// break Eleventy's import of directory data files.)
export default {
	tags: ["sections"],
	permalink: false,
	eleventyDataSchema: function (data) {
		validateSection.call(this, data);
	},
};
