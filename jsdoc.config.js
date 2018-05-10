const config = {
	tags: {
		allowUnknownTags: true,
		dictionaries: ["jsdoc", "closure"]
	},
    source: { include: "src/app" },
    plugins: [ "plugins/markdown" ],
    opts: {
        template: "node_modules/docdash",
        encoding: "utf8",
        destination: "docs/",
        recurse: true,
        verbose: true
    },
    templates: { cleverLinks: true, monospaceLinks: true },
	docdash: { static: false, sort: false }
};

module.exports = config;