chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	var action = request.action;

	console.log(action);
	if(action=='load'){
		sendResponse( storageLoad() );
	}else if(action=='openTab'){
		openTabAll();
		sendResponse( true );
	}else if(action=='getTabURL'){
		getTabURL();
		sendResponse( true );
	}
	else{
		sendResponse( "Boo!" );
	}

});

function storageLoad(){
	return methods.load();
}
function openTabAll(){
	methods.openAtNewWindow();
}
function getTabURL(){
	methods.getTabData();
}