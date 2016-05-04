var scriptsTags = document.getElementsByTagName("script");

// img -- data-sharpsrc -- 
// 嵌入的script脚本中对静态资源的请求，如new Image（）
// 注释后的代码中对静态资源的请求 

// 可以直接扩展

// 模式：
//     n -- normal默认，只获取显式标签
// 	   i -- inline, 在normal的基础上获取内联脚本内部包含的域名
//     c -- comment, 在normal的基础上获取注释中的域名

var config = {
	"mode" : "ic",
	"tag" : {
		"script" : "src",
		"img" : ["src", "data-sharpsrc"],
		"link" : "href",
		"a" : "href"
	},
	"attr": [
		"data-sharpsrc"
	]
};

var Crawler = function(config) {
	this._init(config);
}

Crawler.prototype._init = function(config) {
	this.setTags(config["tag"]);
	this.setDomains();
};

Crawler.prototype.getAttrDomain = function (attrs) {
	for(var i in attrs) {
		var elements = traverseDom(document.getElementsByTagName("html")[0], attrs[i]); 
		console.log(elements);
	}
}

Crawler.prototype.getCommentDomain = function () {

	var comments = traverseDom(document.getElementsByTagName("html")[0], "comment"); 
	var domains = [];
	// !
	var reg = /(http|https):\/\/([^\/]+)\//ig;
	(function(){
		for (var i in comments) {
			var result = comments[i]["nodeValue"].match(reg);
			if(result) {
				for(var j in result) {
					domains.push(result[j].split("/")[2]);
				}
			}
		}
	})();
	return domains;
};

Crawler.prototype.getInlineDomain = function() {
	var inlinescripts = getTags("script").filter(function(item){
		if(item.src === "") { return true; }
		else { return false; }
	});

	var reg = /(http|https):\/\/([^\/]+)\//ig;
	var result = [];
	for(var i in inlinescripts) {
		var matchedDomain = inlinescripts[i].innerHTML.match(reg);
		if(matchedDomain) {
			// 需要遍历
			var domain = (inlinescripts[i].innerHTML.match(reg))[0].split("/")[2];
			result.push(domain);
		}
	}
	return result;
};

Crawler.prototype.setTags = function(config) {
	this.tagInfo = {};
	this.tags = [];
	this.urls = [];
	var tagInfo = this.tagInfo,
		_this = this;
	for(var key in config) {
		var tagName = key;
		tagInfo[tagName] = {};
		var attr = config[key];

		if(typeof(attr) !== "string") {
			for(var i in attr) {
				ff(tagName, attr[i]);
			}
		} else {
			ff(tagName, attr);
		}

		function ff (tagName, attr) {
			var tags = getTags(tagName).filter(function(item){
				if(item[attr] && item[attr] !== "") { return true; }
				else { return false; }
			});

			// ! 需要处理
			tagInfo[tagName]["tag"] = tagInfo[tagName]["tag"] || [];
			tagInfo[tagName]["url"] = tagInfo[tagName]["url"] || [];
			tagInfo[tagName]["tag"] = tagInfo[tagName]["tag"].concat(tags);
			var urls = tagInfo[tagName]["url"] = tagInfo[tagName]["url"].concat((function(t){
				var tagUrl = [];
				for(var i in t) {
					tagUrl.push(tags[i][attr]);
				}
				return tagUrl;
			})(tags));
			_this.tags = _this.tags.concat(tags);
			_this.urls = _this.urls.concat(urls);
		}
	}
};

// 获得一个以域组成的数组
Crawler.prototype.setDomains = function() {

	this.domains = [];
	var urls = this.urls;
	for(var i in urls) {
		var domain = urls[i].split("/")[2];

		// !
		if(domain) {this.domains.push(domain);}
	}

	if (config.mode.indexOf("i") !== -1) {
		var inlineDomain = this.getInlineDomain();
		this.domains.concat(inlineDomain);
		this.tagInfo["inlineScript"] = {};
		this.tagInfo["inlineScript"]["domain"] = inlineDomain;
	} 
	if (config.mode.indexOf("c") !== -1) {
		var commentDomain = this.getCommentDomain();
		this.domains.concat(commentDomain);
		this.tagInfo["comment"] = {};
		this.tagInfo["comment"]["domain"] = commentDomain;
	}

};

Crawler.prototype.getUniqueDomain = function() {

	return unique(this.domains);
	function unique (array) {
		var n = {},r=[];
		for(var i = 0; i < array.length; i++) 
		{
			if (!n[array[i]]) 
			{
				n[array[i]] = true;
				r.push(array[i]);
			}
		}
		return r;
	}
};

function getTags(tagName) {
	var rawTags = document.getElementsByTagName(tagName);
	return Array.prototype.slice.call(rawTags);
};

function traverseDom(curr_element, type) { 
   		
	var typeMap = {
		"comment" : {"nodeName" : "#comment", "nodeType" : 8},
		"data-sharpsrc" : {"nodeName" : "data-sharpsrc", "nodeType" : 2}
	};

    var elements = new Array();  
    
    if (curr_element.nodeName == typeMap[type]["nodeName"] || curr_element.nodeType == typeMap[type]["nodeType"]) {     

        elements[elements.length] = curr_element;     
    }    
    else if(curr_element.childNodes.length>0) {    
        for (var i = 0; i<curr_element.childNodes.length; i++) {    
    	
            elements = elements.concat(traverseDom(curr_element.childNodes[i], type));        
        }     
    }   
    return elements;   
};

var c = new Crawler(config);
console.log(c.tagInfo);
var domains = c.getUniqueDomain();
console.log(domains);
// console.log(c.tags);
// console.log(c.urls);
c.getCommentDomain();
c.getAttrDomain(["data-sharpsrc"]);

var b = document.body;
console.log(b.attributes);
console.log(b.nodeName);
