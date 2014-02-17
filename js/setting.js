(function(){

	var seq = 1;
	var lang;

	/**
	 * 保存されている言語設定を読み込んで反映する
	 */
	function loadLanguege(){
		lang = methods.getLanguege();

		$('.title').text(lang.title);
		$('#save').text(lang.saveAll);
		$('#read').text(lang.openAll);
		$('#get').text(lang.saveTabs);
		$('#clear').text(lang.reset);
		$('.add').text(lang.add);
		$('.saving').text(lang.save);
		$('.openurl').text(lang.openUrl);

		$('[name=name]').attr('placeholder', lang.phSiteTitle);
		$('[name=url]').attr('placeholder', lang.phURL);
	}

	/**
	 * 言語設定
	 */
	function initlanguege(){
		loadLanguege();

		// セレクトボックスのデータ読込
		var selects = $('.lang-select');
		for(var i in languege){
			selects.append(
				$('<option></option>').text(languege[i].name).val(i)
			);
		}

		// 現在選択されている言語をセレクトボックスに設定
		selects.val( methods.getLanguege()['key'] );

		// 言語変更時に読込直す処理
		selects.change(function(){
			methods.setLanguege($(this).val());
			loadLanguege();
		});

		// チェックを入れると設定が現れる
		$('[name=lang-setting]').click(function(){
			if($(this).is(':checked')){
				selects.show(300);
			}else{
				selects.hide(300);
			}
		});
	}

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
		methods.open(id);
	}

	/**
	 * URLからタブを開く処理
	 */
	function openTabUrl(url){
		methods.openUrl(url);
	}


	/**
	 * 全てのURLを開く処理
	 */
	function openTabAll(){
		methods.openAtNewWindow();
	}


	/**
	 * ボックスの生成
	 */
	function generate(data){
		var gen = $('.model').clone();
		gen.removeClass('hide model').hide();
		$('.list').append(gen);

		//　データが存在する場合は設定する
		if(data){
			if(seq < parseInt(data.site_id)){
				seq = parseInt(data.site_id);
			}
			console.log(data);
			gen.find('.sid').text(data.site_id);
			gen.find('[name=name]').val(data.name);
			gen.find('[name=url]').val(data.url);
			gen.find('[name=favicon]').val(data.favicon);
			if(data.postdata){
				gen.find('[name=ispost]').attr("checked", true )
				for(var i in data.postdata){
					addBuddy(gen.find('.buddys'), data.postdata[i]);
				}
				gen.find('.postdata').show();
			}

			gen.find('.issaved').text('true');
		}else{
			seq++;
			gen.find('.sid').text(seq);
		}

		//　閉じるときの処理
		closing(gen);

		// 個別保存処理
		gen.find('.saving').click(function(){
			result = save(gen, true);
			if(result){
				popup(result.msg,'danger');
			}
		});

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

		// チェックボックス処理
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

		// post要素の追加処理
		gen.find('.add').click(function(){
			addBuddy( $(this).parent('.postdata').children('.buddys') );
		});

		// 表示する
		gen.show(300);

	}

	/**
	 * 名前と値の欄のペアを追加する
	 */
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
	 * 初期読み込み処理
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
		return str;
	}

	/**
	 * 渡ってきたjsonを保存する
	 */
	function jsonSave(data){
		for(var i in data){
			methods.saveData(data[i]);
			console.log(data[i]);
		}
	}

	/**
	 * URLの保存処理
	 */
	function save(target, individual){
		var msg = '';

		var sid = target.find('.sid');
		var name = target.find('[name=name]');
		var url = target.find('[name=url]');
		var favicon = target.find('[name=favicon]').val();

		var postdata = new Array();
		var postCheck = true;
		var result = null;

		// エラー表示を消す
		target.removeClass('validate');

		sidStr = trim(sid.text());
		sid.text(sidStr);

		nameStr = trim(name.val());
		name.val(nameStr);

		urlStr = trim(url.val());
		url.val(urlStr);
		isUrl = urlStr.match(/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-.\/?%&=]*)?/);

		// postデータありの場合はそれもチェックする
		if(target.find('[name=ispost]').is(':checked')){
			target.find('.buddy').each(function(){
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
				msg += "URLの形式が正しくありません。<br>";
				postCheck = false;
			}else{
				result = {
					site_id: sidStr,
					contents : {
						site_id : sidStr,
						name : nameStr,
						url : urlStr,
						favicon : favicon,
						postdata : postdata,
					},
				};
			}
		}else{
			if(postCheck){
				msg += "情報が正しく入力されていません。<br>";
				postCheck = false;
			}
		}

		//　データチェック
		if(result){
			target.find('.issaved').text('true');

			// 個別保存か否か判断
			if(individual){
				// 個別保存の場合。保存して終了
				methods.saveData(result);
				console.log(result);
				popup('保存しました', 'success');
				return;
			}else{
				// 一括保存の場合。データを返すだけ
				return {
					data: result,
				}
			}
		}else{
			target.addClass('validate');
			return {
				data: null,
				msg: msg,
			}
		}

	}



	/**
	 * 一括保存処理
	 */
	function saveAll(){
		var msg = '';
		var saveData = new Array();
		var error = 0;

		$('.data-set').not('.model').each(function(){
			result = save($(this));
			if(result.data){
				// 保存配列に追加
				saveData.push( result.data );
			}else{
				msg += result.msg;
				error++;
			}
		});

		// データが正しければ保存を行う
		if(saveData.length > 0 && error == 0){
			jsonSave( saveData );
			popup('保存しました', 'success');
		}else{
			popup(msg, 'danger');
		}

	}

	/**
	 * アラートを出す
	 */
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

	/**
	 * クリア処理を登録
	 */
	function addClear(){
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
	}

	/**
	 * メイン処理開始
	 */
	console.log("start:");
	$(document).ready(function(){
		addClear();

		//言語設定
		initlanguege()

		// 保存されているデータを読み込む
		initLoad();

		// 保存処理の登録
		$('#save').click(function(){
			saveAll();
		});

		// 読込処理の登録
		$('#read').click(function(){
			openTabAll();
		});

		// 生成処理の登録
		$('#generate').click(function(){
			generate();
		});

		//　タブ情報保存
		$('#get').click(function(){
			if(confirm('開いているタブのデータを保存しますか？')){
				methods.getTabData();
				setTimeout(function(){
					location.reload();
				},200);
			}
		});

	});
})();



