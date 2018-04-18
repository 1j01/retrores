
var fs = require("fs");
var slug = require("slug");
var beautify_html = require("js-beautify").html;
var Template = require("template-js");
var resources = require("./catalog.js");

var site_folder = "docs";

try {
	fs.mkdirSync(site_folder);
} catch (e) {
	if (e.code !== "EEXIST") {
		console.error(e);
	}
}

var beautify_and_output_html = function(html_content, html_file_path){
	html_content = beautify_html(html_content, {
		indent_with_tabs: true,
		max_preserve_newlines: 0, // we output excessive newlines with our templating, especially in lists
	});
	fs.writeFileSync(require("path").join(site_folder, html_file_path), html_content);
};

resources.forEach(function (resource) {
	if(!resource.title){
		throw new TypeError("Resource is missing title! " + JSON.stringify(resource));
	}
	var path_slug = slug(resource.title, {lower: true});
	resource.__pathSlug = path_slug;
	resource.__htmlPath = path_slug + ".html";
	resource.__pageLink = resource.__htmlPath;
});
resources.forEach(function (resource) {
	var html_file_path = resource.__htmlPath;
	var html_content = new Template("templates/resource-page-template.html", resource).toString();
	beautify_and_output_html(html_content, html_file_path);
});

var homepage_html = new Template("templates/homepage-template.html", {resources}).toString();
beautify_and_output_html(homepage_html, "index.html");
