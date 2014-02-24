var methods = {
	init: function(){},

	zeroPadding: function ( val ) {
		return ( "00" + val ).slice( -3 )
	},

	/**
	 * 保存処理
	 */
	saveData: function(data){
		if(data){
			localStorage[ data['site_id'] ] = JSON.stringify(data['contents']);
			console.log("saved data: " + localStorage[ data['site_id'] ]);
		}else{
			console.log('Boo!');
		}
	},

	/**
	 * localStorageのKey値の最大値を取得する
	 */
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

	/**
	 * 保存されているURL情報を取得する
	 */
	load: function(id){
		var result;

		if(id){
			result = JSON.parse(localStorage[id]);
		}else{
			result = new Array();

			for(var i in localStorage){
				if(i == "lang"){
					continue;
				}
				data = JSON.parse(localStorage[i]);
				result.push(data);
			}
		}
		return result;
	},

	/**
	 * 指定されたidのデータを削除する
	 */
	del: function(id){
		localStorage.removeItem(id);
	},

	/**
	 * 新しいChromeのウインドウを立ち上げてURLを開く
	 */
	openAtNewWindow: function(id){
		data = this.load();
		console.log('first',data);

//		data.shift(); //最初のデータを削除

		chrome.windows.create({
			url: data[0].url
		},
		function (window){
			for(var i in data){
				if(i==0){
					continue;
				}
				chrome.tabs.create({
					windowId: window.id,
					selected: true,
					url: data[i].url,
				});
			}
		});
	},

	/**
	 * タブを開く
	 */
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

	/**
	 * 指定されたURLを新しいタブで開く
	 */
	openUrl: function(url){
		// タブを開く処理
		chrome.tabs.create({
			selected: true,
			url: url,
		});
	},

	/**
	 * 現在開いているタブのデータを取得して保存する
	 */
	getTabData: function(){
		maxIndex = this.getMaxIndex();
		var group = 1;

		function zeroPadding( val ) {
			return ( "00" + val ).slice( -3 )
		};


		function saveFromTab(tabData){
			var result;
			if(tabData){
				for(var i in tabData){
					maxIndex++;
					contents = {
						site_id : zeroPadding(maxIndex),
						seqno : maxIndex,
						group: group,
						name : tabData[i].title,
						url : tabData[i].url,
						favicon : tabData[i].favicon
					};

					localStorage[ zeroPadding(maxIndex) ] = JSON.stringify( contents );
					console.log( localStorage[ maxIndex ]);
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
					tabDatas[i] = data;
				}
			}
			saveFromTab(tabDatas);
		});
	},

	/**
	 * localStorageのデータをクリアする
	 */
	clear: function(){
		localStorage.clear();
	},

	/**
	 * アラート。多分使わない
	 */
	msg: function(args){
		alert(args);
	},

	/**
	 * 言語設定を取得する
	 */
	getLanguage: function(){
		lang = localStorage["lang"];
		if(!lang){
			lang = language[chrome.i18n.getMessage("defaultLang")];
			localStorage["lang"] = chrome.i18n.getMessage("defaultLang");
			console.log("language init.");
		}else{
			lang = language[lang];
		}
		return lang;
	},

	/**
	 * 言語設定を保存する
	 */
	setLanguage: function(lang){
		localStorage["lang"] = lang;
	}

}