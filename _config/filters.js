// Resolves a site-relative URL against metadata.url, honoring --pathprefix
// (project pages) the way the RSS plugin's htmlBaseUrl does for the blogs.
function absoluteUrl(url, base) {
	try {
		const pathPrefix = this.page?.pathPrefix ?? "/";
		const baseUrl = new URL(base, "http://eleventy.invalid");
		if (baseUrl.pathname === "/" && pathPrefix !== "/") {
			baseUrl.pathname = pathPrefix.replace(/\/$/, "") + "/";
		}
		return new URL(url, baseUrl).href.replace("http://eleventy.invalid", "");
	} catch {
		return url;
	}
}

export default function (eleventyConfig) {
	eleventyConfig.addFilter("absoluteUrl", function (url, base) {
		return absoluteUrl.call(this, url, base);
	});
	eleventyConfig.addFilter("htmlDateString", (dateObj) =>
		new Date(dateObj).toISOString().split("T")[0],
	);
}
