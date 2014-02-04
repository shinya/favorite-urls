(function(){
	function closing(target){
		target.children('.close').click(function(){
			$(this).parent('.data-set').remove();
		});
	}

	$(document).ready(function(){


		// 保存処理
		$('#save').click(function(){
			var url = $('#choko').text();
			methods.save('choko', url, 'ちょこきんと見せかけてのyahoo');
		});

		// 読込処理
		$('#read').click(function(){
			result = methods.load('choko');

			if(result.status){
				alert(result.url);
			}else{
				alert(result.msg);
			}
		});

		$('#generate').click(function(){
			var gen = $('.model').clone();
			gen.removeClass('hide model').show();
			$('.list').append(gen);
			closing(gen);
		});


		$('.saving').click(function(){

		});
	});
})();



