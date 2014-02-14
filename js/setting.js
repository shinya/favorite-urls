(function(){

	var seq = 1;

	/**
	 * ×ボタンをおした時の挙動
	 */
	function closing(target){
		target.children('.close').click(function(){
			$(this).parent('.data-set').remove();
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
				gen.find('[name=id]').val(data.postdata.login_id);
				gen.find('[name=pass]').val(data.postdata.login_id);
				gen.find('.postdata').show();
			}
			// URLを開く
			gen.find('.openurl').click(function(){
				openTab(data.site_id);
			});
		}else{
			closing(gen);
		}

		seq++;
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
		methods.saveData(data);
		console.log(data);
	}

	/**
	 * urlデータの保存
	 */
	function saving(target){
		$('.data-set').not('.model').each(function(){
			var sid = $(this).find('.sid');
			var name = $(this).find('[name=name]');
			var url = $(this).find('[name=url]');
			var post_data;

			sidStr = trim(sid.text());
			sid.text(sidStr);

			nameStr = trim(name.val());
			name.val(nameStr);

			urlStr = trim(url.val());
			url.val(urlStr);
			isUrl = urlStr.match(/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-.\/?%&=]*)?/);

			// postデータありの場合はそれもチェックする
			if($(this).find('[name=ispost]').is(':checked')){
				var login_id = $(this).find('[name=id]').val();
				var pass = $(this).find('[name=pass]').val();

				if(login_id && pass){
					postdata = {
							login_id: login_id,
							pass: pass,
					};
				}else{
					popup("ログインデータがありません。id:"+sidStr, 'danger');
				}
			}else{
				postdata = null;
			}


			if(sidStr && nameStr && urlStr){
				if(!isUrl){
					popup("URLの形式がただしくありません。id:"+sidStr, 'danger');
				}else{
					var result = {
						site_id: sidStr,
						contents : {
							site_id: sidStr,
							name: nameStr,
							url: urlStr,
							postdata: postdata,
						},
					};
				}
			}else{
				popup("パラメーターが正しく設定されていません。id:"+sidStr, 'danger');
			}

			// データが正しければ保存を行う
			if(result){
				jsonSave( result );
			}

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

		// チェック処理
		$('[name=ispost]').click(function(){
			if($(this).is(':checked')){
				$(this).parent().nextAll('.postdata').show(300);
			}else{
				$(this).parent().nextAll('.postdata').hide(300);
			}
		})

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



