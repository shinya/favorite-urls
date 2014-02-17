(function(){

	/**
	 * 保存されている言語設定を読み込んで反映する
	 */
	function loadLanguege(){
		var lang;
		lang = methods.getLanguege();

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

		$('#open').click(function(){
			methods.openAtNewWindow();
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

		// タブデータの保存
		$('#get').click(function(){
			methods.getTabData();
			window.close();
			return false;
		});

		// 言語設定を読み込む
		loadLanguege()

	});

})();



