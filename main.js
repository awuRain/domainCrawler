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

var domain_crawler1 = new domain_crawler(config);
// console.log(domain_crawler1);

var domains = domain_crawler1.getUniqueDomain();
// console.log(domains);

