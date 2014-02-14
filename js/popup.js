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
//						function(tab){}
			}
		});
	});

})();



