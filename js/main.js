var methods = {
	init: function(){},

	save: function(id, url, name){

		if(!(id && url && name)){
			console.log('invalid.');
			return false;
		}

		console.log(url, name);

		localStorage[id+'_url'] = url;
		localStorage[id+'_name'] = name;

		console.log('saved.');
	},

	saveData: function(data){
		if(data){
			localStorage[ data['site_id'] ] = data['contents'];
		}else{
			console.log('Boo!');
		}

	},

	load: function(id){

		if(!id){
			return {
				'status': false,
				'msg': 'id is null',
			};
		}

		var url = localStorage[id+'_url'];
		var name = localStorage[name+'_name'];

		if(!url){
			return {
				'status' : false,
				'msg': 'url is null',
			};
		}

		ret = {
			'status': true,
			'msg': 'data is valid',
			'url' : url,
			'name': name,
		};

		return ret;

	},

	clear: function(){
		localStorage.clear();
	},

	msg: function(args){
		alert(args);
	},
}