chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	var action = request.action;

	console.log(action);
	if(action=='load'){
		sendResponse( storageLoad() );
	}
	else{
		sendResponse( "Boo!" );
	}

});

function storageLoad(){
	return methods.load();
}
