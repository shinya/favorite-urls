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
	});

})();



