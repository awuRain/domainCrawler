var domain_crawler = require('domain-crawler');

var url = "http://lvyou.baidu.com/";

var config = {
	// 感觉名称不太对
	// DOM || RAW
	"mode" : "DOM",
	"depth" : 3,
	"tag" : {
		"script" : "src",
		"img" : ["src", "data-sharpsrc"],
		"link" : "href",
		"a" : "href"
	},
	"attr" : [
		"data-sharpsrc"
	],
	"out" : [{
		"path" : './summary.txt',
		'content' : 'summary'
	},{
		"path" : './all.txt',
		'content' : 'all'  
	}]
};

var domain_crawler_1 = new domain_crawler(config);

domain_crawler_1.crawl(url);
