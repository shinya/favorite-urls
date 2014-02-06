(function(){
	/**
	 * ×ボタンをおした時の挙動
	 */
	function closing(target){
		target.children('.close').click(function(){
			$(this).parent('.data-set').remove();
		});
	}

	/**
	 * 新しいボックスの生成
	 */
	function generate(target){
		$('#generate').click(function(){
			var gen = $('.model').clone();
			gen.removeClass('hide model').show();
			$('.list').append(gen);
			closing(gen);
			saving(gen);
		});
	}

	/**
	 * 入力されている文字列が有効か判定する
	 */
	function trim(target, urlFlag){
		var str = target.val().replace(/(^[\s　]+)|([\s　]+$)/g, "");
		target.val(str);
		return str;
	}

	/**
	 * 渡ってきたｊｓｏｎを保存する
	 */
	function jsonSave(data){
		console.log(data);
	}

	/**
	 * urlデータの保存
	 */
	function saving(target){
		target.find('.saving').click(function(){
			var sid = $(this).parent().children('[name=sid]');
			var name = $(this).parent().children('[name=name]');
			var url = $(this).parent().children('[name=url]');

			sidStr = trim(sid);
			nameStr = trim(name);
			urlStr = trim(url);

//			isUrl = urlStr.match(/^(https?|ftp)(:¥/¥/[-_.!~*¥'()a-zA-Z0-9;¥/?:¥@&=+¥$,%#]+)$/);
			isUrl = urlStr.match(/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-.\/?%&=]*)?/);


			if(sidStr && nameStr && urlStr){
				if(!isUrl){
					popup("URLの形式がただしくありません", 'danger');
				}else{
					var result = {};
					result[sidStr] = {
						name: nameStr,
						url: urlStr,
					};
				}
			}else{
				popup("パラメーターが正しく設定されていません", 'danger');
			}

			// データが正しければ保存を行う
			if(result){
				jsonSave( result );
			}

			//			console.log(sidStr, nameStr, urlStr);

		});


	}

	function popup(str, type){

		if(!type){
			type = '.alert-warning';
		}else{
			type = '.alert-' + type;
		}

		var target = $(type);
		target.text(str).fadeIn(500);
		setTimeout(function(){
			target.fadeOut(1000,function(){
				$(this).text('');
			});
		},2000);
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

		// 生成処理
		generate();

	});
})();



