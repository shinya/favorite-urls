(function(){

	var seq = 1;
	var lang;

	/**
	 * 保存されている言語設定を読み込んで反映する
	 */
	function loadLanguage(){
		lang = methods.getLanguage();

		// extensionの設定から文言を取得する
		$('#language').text( chrome.i18n.getMessage("languageSetting") );

		$('title').text(lang.setting);
		$('.title').text(lang.title);
		$('#save').text(lang.saveAll);
		$('#read').text(lang.openAll);
		$('#get').text(lang.saveTabs);
		$('#clear').text(lang.reset);
		$('.add').text(lang.add);
		$('.saving').text(lang.save);
		$('.openurl').text(lang.openUrl);

		$('.cbtext').text(lang.useParam);
		$('[name=name]').attr('placeholder', lang.phSiteTitle);
		$('[name=url]').attr('placeholder', lang.phURL);
		$('[name=ele-name]').attr('placeholder', lang.phName);
		$('[name=ele-value]').attr('placeholder', lang.phValue);

		$('#msg-clear-confirm').text(lang.msgClearConfirm);
		$('#msg-save-tabdata').text(lang.msgSaveTabData);
		$('#msg-delete-confirm').text(lang.msgDeleteConfirm);
		$('#msg-deleted').text(lang.msgDeleted);
		$('#msg-saved').text(lang.msgSaved);
		$('#msg-incorrect-login').text(lang.msgIncorrectLogin);
		$('#msg-incorrect-url').text(lang.msgIncorrectUrl);
		$('#msg-incorrect-data').text(lang.msgIncorrectData);

		gen = $('.generate').attr('id',lang.button).detach();
		$('.add-data-set').append(gen);
	}

	/**
	 * 言語設定
	 */
	function initlanguage(){
		loadLanguage();

		// セレクトボックスのデータ読込
		var selects = $('.lang-select');
		for(var i in language){
			selects.append(
				$('<option></option>').text(language[i].name).val(i)
			);
		}

		// 現在選択されている言語をセレクトボックスに設定
		selects.val( methods.getLanguage()['key'] );

		// 言語変更時に読込直す処理
		selects.change(function(){
			methods.setLanguage($(this).val());
			loadLanguage();
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
				if(confirm( $('#msg-delete-confirm').text() )){
					id = target.find('.sid').text();
					methods.del( methods.zeroPadding(parseInt(id)) );
					$(this).parent('.data-set').remove();

					popup($('#msg-deleted').text(), 'success');
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
	function generate(data, clicked){
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
			gen.find('.sid').attr('seq', data.seqno);
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

		// クリックされて追加された場合（ユーザーが画面から追加する場合）
		if(clicked){
			// 追加ボタンの位置調整（最後に持ってくる）
			clicked.parent('.list').children('.data-set').last().after(
					clicked
			);
		}

	}

	/**
	 * 名前と値の欄のペアを追加する
	 */
	function addBuddy(target, data){
		var buddy = $('.buddy-model').clone();
		buddy.removeClass('hide buddy-model').hide();
		buddy.find('.remove').click(function(){
			$(this).parent('.buddy').remove();
		});

		buddy.find('.security').click(function(){
			var val = buddy.find('[name=ele-value]');
			var type = val.attr('type');
			if(type == "password"){
				val.attr('type', 'text');
				$(this).find('i').addClass('icon-eye-open').removeClass('icon-eye-close');
			}else{
				val.attr('type', 'password');
				$(this).find('i').addClass('icon-eye-close').removeClass('icon-eye-open');
			}
		});

		if(data){
			buddy.find('[name=ele-name]').val(data.name);
			buddy.find('[name=ele-value]').val(data.value);
			buddy.find('[name=ele-value]').attr('type', data.type);

			var val = buddy.find('[name=ele-value]');
			var type = val.attr('type');
			if(type == "password"){
				val.attr('type', 'password');
				buddy.find('.security').find('i').addClass('icon-eye-close').removeClass('icon-eye-open');
			}else{
				val.attr('type', 'text');
				buddy.find('.security').find('i').addClass('icon-eye-open').removeClass('icon-eye-close');
			}
		}
		target.append(buddy);
		buddy.show(200);
	}


	/**
	 * 初期読み込み処理
	 */
	function initLoad(){
		result = methods.load();

		result.sort(
			function(a, b){
				var l = parseInt(a.seqno);
				var r = parseInt(b.seqno);
				if(l < r){
					return -1;
				}else if(l > r){
					return 1;
				}else{
					return 0;
				}
			}
		);

		for(var i in result){
			generate(result[i]);
		}

		$('.list').children('.data-set').last().after(
			$('.add-data-set')
		);
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
		var seqNo = sid.attr('seq');
		var group = sid.attr('group');

		if(!group){
			group = 1;
		}

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
				var type = $(this).find('[name=ele-value]').attr('type');
				if(name && value){
					buddydata = {
						name: name,
						value: value,
						type: type,
					};
					postdata.push(buddydata);
				}else{
					msg += $('#msg-incorrect-login').text() + "<br>";
					postCheck = false;
				}
			});

		}else{
			postdata = null;
		}

		if(sidStr && nameStr && urlStr && postCheck){
			if(!isUrl){
				msg += $('#msg-incorrect-url').text() + "<br>";
				postCheck = false;
			}else{
				result = {
					site_id: methods.zeroPadding( parseInt(sidStr) ),
					contents : {
						site_id : methods.zeroPadding( parseInt(sidStr) ),
//						seqno: methods.zeroPadding( parseInt(seqNo) ),
						seqno: parseInt(seqNo),
						group: group,
						name : nameStr,
						url : urlStr,
						favicon : favicon,
						postdata : postdata,
					},
				};
			}
		}else{
			if(postCheck){
				msg += $('#msg-incorrect-data').text() + "<br>";
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
				popup( $('#msg-saved').text() , 'success');
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
			popup( $('#msg-saved').text() , 'success');
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
			if(confirm( $('#msg-clear-confirm').text() )){
				methods.clear();
				location.reload();
			}
		});
	}

	function renumber(){
		var seqNo = 1;
		$('.data-set').not('.model').each(function(){
			$(this).find('.sid').attr('seq', seqNo);
			seqNo++;
		});
	}

	/**
	 * ============================
	 *   メイン処理開始
	 * ============================
	 */
	console.log("start:");
	$(document).ready(function(){
		//言語設定
		initlanguage()

		addClear();

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
		$('.generate').click(function(){
			generate(undefined, $(this).parent('.add-data-set'));
			renumber();
		});

		//　タブ情報保存
		$('#get').click(function(){
			if(confirm( $('#msg-save-tabdata').text() )){
				methods.getTabData();
				setTimeout(function(){
					location.reload();
				},200);
			}
		});

		$('.list').sortable({
			containment: 'parent',
			connectWith: '.data-set',
			cancel: '.generate',
			update: function(){
				renumber();
			}
		});

	});
})();



