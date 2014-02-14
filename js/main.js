var methods = {
	init: function(){},

	save: function(id, url, name){

		if(!(id && url && name)){
			console.log('invalid.');
			return false;
		}

		console.log(url, name);

		localStorage[id+'_url'] = url;
		localStorage[id+'_name'] = name;

		console.log('saved.');
	},

	saveData: function(data){
		if(data){
			localStorage[ data['site_id'] ] = JSON.stringify(data['contents']);
//			console.log("saved data: " + localStorage[ data['site_id'] ]);
		}else{
			console.log('Boo!');
		}

	},

	getMaxIndex: function(){
		var buf = -1;
		for(var i in localStorage){
			if(buf < i){
				buf = parseInt(i);
			}
		}

		if(buf == -1){
			buf = 0;
		}
		return buf;
	},

	load: function(id){
		var result;

		if(id){
			result = JSON.parse(localStorage[id]);
		}else{
			result = new Array();

			for(var i in localStorage){
				data = JSON.parse(localStorage[i]);
				result[i] = data;
			}
		}
		return result;
	},

	del: function(id){
		localStorage.removeItem(id);
	},

	open: function(id){
		function fakePost(url, data){
			data = JSON.parse(data);
		    var form = document.createElement("form");
		    form.setAttribute("method", "post");
		    form.setAttribute("action", url);

		    for(var key in data) {
		        var hiddenField = document.createElement("input");
		        hiddenField.setAttribute("type", "hidden");
		        hiddenField.setAttribute("name", key);
		        hiddenField.setAttribute("value", data[key]);
		        form.appendChild(hiddenField);
		    }
		    document.body.appendChild(form);
		    form.submit();
		    document.body.removeChild(form);

		};

		var result = JSON.parse(localStorage[id]);

		if(result.postdata){
			//minify function
			fakePostCode = fakePost.toString().replace(/(\n|\t)/gm,'');

			alert(result.url);
			chrome.tabs.create({
				selected: true,
				url : "javascript:"+fakePostCode+"; fakePost('" + result.url + "', '" + JSON.stringify(result.postdata) + "');"
//				url : "javascript:"+fakePostCode+"; fakePost('" + result.url + "');"
//				url : "javascript: fakePost(" + result.url + "," + JSON.stringify(result.postdata) + ");"
			});
		}else{
			// タブを開く処理
			chrome.tabs.create({
				selected: true,
				url: result.url,
			});
		}
	},

	openUrl: function(url){
		// タブを開く処理
		chrome.tabs.create({
			selected: true,
			url: url,
		});
	},

	getTabData: function(){
		maxIndex = this.getMaxIndex();

		function saveFromTab(tabData){
			var result;
			if(tabData){
				for(var i in tabData){
					maxIndex++;
					contents = {
						site_id : maxIndex,
						name : tabData[i].title,
						url : tabData[i].url,
					};

					localStorage[ maxIndex ] = JSON.stringify( contents );
					console.log(localStorage[ maxIndex ]);
				}
			}
		};

		chrome.tabs.getAllInWindow(null, function(tabs){
			tabDatas = new Array();
			for(var i in tabs){
				var data;
				if(tabs[i].url.indexOf("http", 0) == 0){
					data = {
						title: tabs[i].title,
						url: tabs[i].url,
						favicon: tabs[i].favIconUrl,
					};
					tabDatas.push(data);
//					console.log(tabDatas);
				}
			}
//			console.log(tabDatas);
			saveFromTab(tabDatas);
		});

		//ここに来たらコールバックのため、tabDatasの値が取れないからなんとかする必要がある

	},

	clear: function(){
		localStorage.clear();
	},

	msg: function(args){
		alert(args);
	},

}