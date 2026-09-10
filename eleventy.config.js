import { HtmlBasePlugin, InputPathToUrlTransformPlugin } from "@11ty/eleventy";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import pluginNavigation from "@11ty/eleventy-navigation";
import markdownIt from "markdown-it";
import pluginFilters from "./_config/filters.js";

export default function (eleventyConfig) {
	// Copy everything in public/ to the site root verbatim
	eleventyConfig.addPassthroughCopy({ "./public/": "/" });
	eleventyConfig.addPassthroughCopy("./js/");

	// Watch css and js for live reload (they are inlined/bundled, not linked)
	eleventyConfig.addWatchTarget("css/**/*.css");
	eleventyConfig.addWatchTarget("js/**/*.js");
	eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpg,jpeg,gif}");

	// Inline <style> tags get swept into the per-page css bundle
	eleventyConfig.addBundle("css", {
		toFileDirectory: "dist",
		bundleHtmlContentFromSelector: "style",
	});

	eleventyConfig.setLibrary(
		"md",
		markdownIt({ html: true, breaks: false, linkify: true, typographer: true }).disable("code"),
	);

	// Homepage sections: content/sections/*.md, sorted by order (then
	// filename). permalink: false keeps them out of _site/ as standalone
	// pages (see content/sections/sections.11tydata.js); front matter is
	// validated by content/_data/eleventyDataSchema.js.
	eleventyConfig.addCollection("sections", function (collectionApi) {
		return collectionApi.getFilteredByGlob("content/sections/*.md").sort((a, b) => {
			const aOrder = a.data.order ?? 999;
			const bOrder = b.data.order ?? 999;
			if (aOrder !== bOrder) return aOrder - bOrder;
			return a.inputPath.localeCompare(b.inputPath);
		});
	});

	eleventyConfig.addPlugin(pluginFilters);
	eleventyConfig.addPlugin(pluginNavigation);
	eleventyConfig.addPlugin(HtmlBasePlugin);
	eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);
	eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
		formats: ["avif", "webp", "auto"],
		failOnError: false,
		htmlOptions: {
			imgAttributes: {
				loading: "lazy",
				decoding: "async",
			},
		},
		sharpOptions: {
			animated: true,
		},
	});

	eleventyConfig.setServerOptions({ showAllHosts: true });

	eleventyConfig.addShortcode("currentYear", () => String(new Date().getFullYear()));

	return {
		dir: {
			input: "content",
			includes: "../_includes",
			data: "_data",
			output: "_site",
		},
		templateFormats: ["md", "njk", "html"],
		markdownTemplateEngine: "njk",
		htmlTemplateEngine: "njk",
		passthroughFileCopy: true,
	};
}
