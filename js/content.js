(function(){
	$(document).ready(function(){

		chrome.extension.sendRequest({
			"action": "load"
		}, function(response) {
			var data = response;
			var target;

			for(var i in data){
				if(data[i].url == location.href){
					console.log("Yes!");
					target = data[i];
					break;
				}
			}

			if(target){
				if(target.postdata){
					console.log('same!');
					for(var i in target.postdata){
						// アクション属性があった場合、POST先を変更する
						if(target.postdata[i].name == 'action'){
							$('form').attr('action', target.postdata[i].value);
							console.log('action!');
							continue;
						}else{
							var input = $('[name="'+ target.postdata[i].name +'"]');

							if(input.size() > 0 ){
								input.val(target.postdata[i].value);
								console.log(i, target.postdata[i])
							}else{
								return ;
							}

						}

					}

					$('form').submit();
				}else{
					console.log('different.');
					return;
				}
			}


		});
	});
})();