var http = require('http');
var cheerio = require('cheerio');
var domain_crawler = require('domain-crawler');

var url = "http://www.baidu.com/"

var config = {
	"mode" : "n",
	"tag" : {
		"script" : "src",
		"img" : ["src", "data-sharpsrc"],
		"link" : "href",
		"a" : "href"
	},
	"attr": [
		"data-sharpsrc"
	],
	"url": url
};

var domain_crawler_1 = new domain_crawler(config);
domain_crawler_1.init.then(function() {
		domain_crawler_1.crawl();
	}
);