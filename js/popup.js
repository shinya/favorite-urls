(function(){

	/**
	 * 保存されている言語設定を読み込んで反映する
	 */
	function loadLanguage(){
		var lang;
		lang = methods.getLanguage();

		$('.title').text(lang.title);
		$('#open').text(lang.openAll);
		$('#get').text(lang.saveTabs);
		$('#action').text(lang.setting);
	}


	$(document).ready(function(){
		$('#action').click(function(){
			var url = $(this).attr('url');
			chrome.tabs.create(
				{
					'selected' : true,
					'url' : url
				},
				function(tab){}
			);
		});

		// 全てを開く
		$('#open').click(function(){
			chrome.extension.sendRequest({
				"action": "openTab"
			}, function(response) {
				console.log(response);
			});
		});

		// タブデータの保存
		$('#get').click(function(){
			chrome.extension.sendRequest({
				"action": "getTabURL"
			}, function(response) {
				console.log(response);
				window.close();
			});

//			methods.getTabData();
//			return false;
		});

		result = methods.load();

		for(var i in result){
			var link = $('.model').clone();
			link.removeClass('hide model');
			link.children('a').attr('href', result[i].url).text(result[i].name).show();

			if(result[i].favicon){
				link.prepend(
						$('<img>')
						.attr('src', result[i].favicon)
						.addClass('icon')
				);
			}else{
				link.prepend(
					$('<i></i>')
					.addClass('icon-star-empty')
				);
			}

			$('.urls').append(link);
		}

		$('.url').children('a').click(function(){
			chrome.tabs.create({
				'selected' : true,
				'url' : $(this).attr('href'),
			});
		});


		// 言語設定を読み込む
		loadLanguage()

	});

})();



