(function(){

	var seq = 1;

	/**
	 * ×ボタンをおした時の挙動
	 */
	function closing(target){
		target.children('.close').click(function(){
			if(target.find('.issaved').text() == 'true'){
				if(confirm('削除しますか？')){
					id = target.find('.sid').text();
					methods.del(id);
					$(this).parent('.data-set').remove();

					popup('削除しました', 'success');
				}
			}else{
				// 一度も保存されていなければそのまま削除
				$(this).parent('.data-set').remove();
			}
		});
	}

	/**
	 * タブを開く処理
	 */
	function openTab(id){
//		methods.open(target.find('[name=url]').val());
		methods.open(id);
	}

	/**
	 * URLからタブを開く処理
	 */
	function openTabUrl(url){
//		methods.open(target.find('[name=url]').val());
		methods.openUrl(url);
	}


	/**
	 * 全てのURLを開く処理
	 */
	function openTabAll(){
		$('.data-set').not('.model').each(function(){
			openTab($(this).find('.sid').text());
		});
	}

	/**
	 * 新しいボックスの生成
	 */
	function generate(data){
		var gen = $('.model').clone();
		gen.removeClass('hide model').show();
		$('.list').append(gen);

		gen.find('.sid').text(seq);

		if(data){
			console.log(data);
			gen.find('[name=name]').val(data.name);
			gen.find('[name=url]').val(data.url);
			if(data.postdata){
				gen.find('[name=ispost]').attr("checked", true )
				for(var i in data.postdata){
					addBuddy(gen.find('.buddys'), data.postdata[i]);
				}
				gen.find('.postdata').show();
			}

			gen.find('.issaved').text('true');
		}else{
		}

		//　閉じるときの処理
		closing(gen);

		// URLを開く
		gen.find('.openurl').click(function(){
			var issaved = $(this).parents('.data-set').find('.issaved').text();
			if(issaved == 'true'){
//				openTab(data.site_id);
				openTabUrl($(this).parents('.data-set').find('[name=url]').val());
			}else{
				openTabUrl($(this).parents('.data-set').find('[name=url]').val());
			}
		});

		// チェック処理
		gen.find('[name=ispost]').click(function(){
			if($(this).is(':checked')){
				if($(this).parent().parent().find('.buddy').size() < 1){
					addBuddy( $(this).parent().parent().find('.buddys') );
				}
				$(this).parent().nextAll('.postdata').show(300);
			}else{
				$(this).parent().nextAll('.postdata').hide(300);
			}
		});

		// 要素の追加処理
		gen.find('.add').click(function(){
			addBuddy( $(this).parent('.postdata').children('.buddys') );
		});



		seq++;
	}

	function addBuddy(target, data){
		var buddy = $('.buddy-model').clone();
		buddy.removeClass('hide buddy-model').show();
		buddy.find('.remove').click(function(){
			$(this).parent('.buddy').remove();
		});

		if(data){
			buddy.find('[name=ele-name]').val(data.name);
			buddy.find('[name=ele-value]').val(data.value);
		}
		target.append(buddy);

	}


	/**
	 * 初期の保存データ読み込み処理
	 */
	function initLoad(){
		result = methods.load();
		for(var i in result){
			generate(result[i]);
		}
	}

	/**
	 * 入力されている文字列が有効か判定する
	 */
	function trim(target){
		var str = target.replace(/(^[\s　]+)|([\s　]+$)/g, "");
//		target.val(str);
		return str;
	}

	/**
	 * 渡ってきたｊｓｏｎを保存する
	 */
	function jsonSave(data){
		for(var i in data){
			methods.saveData(data[i]);
			console.log(data[i]);
		}
	}

	/**
	 * urlデータの保存
	 */
	function saving(target){
		var msg = '';
		var saveData = new Array();
		var error = 0;

		$('.data-set').not('.model').removeClass('validate');

		$('.data-set').not('.model').each(function(){
			var sid = $(this).find('.sid');
			var name = $(this).find('[name=name]');
			var url = $(this).find('[name=url]');
			var postdata = new Array();
			var postCheck = true;
			var result = null;

			sidStr = trim(sid.text());
			sid.text(sidStr);

			nameStr = trim(name.val());
			name.val(nameStr);

			urlStr = trim(url.val());
			url.val(urlStr);
			isUrl = urlStr.match(/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-.\/?%&=]*)?/);

			// postデータありの場合はそれもチェックする
			if($(this).find('[name=ispost]').is(':checked')){
				$(this).find('.buddy').each(function(){
					var buddydata;
					var name = $(this).find('[name=ele-name]').val();
					var value = $(this).find('[name=ele-value]').val();
					if(name && value){
						buddydata = {
							name: name,
							value: value,
						};
						postdata.push(buddydata);
					}else{
						msg += "ログインデータが不正です。<br>";
						postCheck = false;
						error++;
					}
				});

			}else{
				postdata = null;
			}

			if(sidStr && nameStr && urlStr && postCheck){
				if(!isUrl){
					msg += "URLの形式がただしくありません。<br>";
					postCheck = false;
				}else{
					result = {
						site_id: sidStr,
						contents : {
							site_id : sidStr,
							name : nameStr,
							url : urlStr,
							postdata : postdata,
						},
					};
				}
			}else{
				if(postCheck){
					msg += "パラメーターが正しく設定されていません。<br>";
					postCheck = false;
				}
			}

			// データが正しければ保存を行う
			if(result){
				saveData.push(result);
				$(this).find('.issaved').text('true');
			}else{
				error++;
				$(this).addClass('validate');
			}
		});

		// データが正しければ保存を行う
		if(saveData.length > 0 && error < 1){
			jsonSave( saveData );
			popup('保存しました', 'success');
		}else{
			popup(msg, 'danger');
		}

	}

	function popup(str, type){

		if(!type){
			type = '.alert-warning';
		}else{
			type = '.alert-' + type;
		}

		var target = $(type);
		target.html(str).fadeIn(500);
		setTimeout(function(){
			target.fadeOut(1000,function(){
				$(this).html('');
			});
		},2000);
	}


	$(document).ready(function(){
		// 保存処理
		$('#save').click(function(){
			saving();
		});

		// 読込処理
		$('#read').click(function(){
			openTabAll();
		});

		// 生成処理
		$('#generate').click(function(){
			generate();
		});

		// 保存されているデータを読み込む
		initLoad();

		// クリア処理
		$('#clear').click(function(){
			if(confirm('全データを削除しますか？')){
				if(confirm('ほんとに削除しますか？元に戻せないですよ？')){
					if(confirm('後悔しませんね？')){
						methods.clear();
						location.reload();
					}
				}
			}
		});


	});
})();



