(function(){
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
			result = methods.load();
			for(var i in result){
				chrome.tabs.create({
					'selected' : true,
					'url' : result[i].url
				});
			}
		});


		result = methods.load();

		for(var i in result){
			var link = $('.model').clone();
			link.removeClass('hide model');
			link.children('a').attr('href', result[i].url).text(result[i].name).show();

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


	});

})();



