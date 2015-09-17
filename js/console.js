var currentMessageQueue = [];

function getLog() {
	return $('#log');
}

function log(message) {
	var theLog = getLog();
	theLog.append('<p>' + message + '</p>');
	var height = theLog[0].scrollHeight;
	theLog.scrollTop(height);
	
	if(theLog.children().length > 50) {
		theLog.children('*:first').remove();
	}
}

function getCommandPanel() {
	return $('#commandPanel > div:first');
}

function showMessageQueue(messageQueue) {
	currentMessageQueue.length = 0;
	currentMessageQueue = messageQueue;
	continueMessageQueue();
}

function continueMessageQueue() {
	if(currentMessageQueue.length > 0) {
		if(currentMessageQueue[0].isChoice) {
			showChoices(currentMessageQueue);
		}
	} else {
		clearText();
	}
}

function showText(message) {
	getCommandPanel().html(message);
}

function showChoices(message, choices) {
	clearText();
	
	GAME_MODE = MODE_CHOICE;
	
	var list = getCommandPanel().append('<p>' + message + '</p>').append('<ol></ol>').find('ol');
	
	for(var i = 0; i < choices.length; i++) {
		var link = $('<a id="choice' + (i+1) + '" href="#">' + choices[i].text + '</a>');
		link.click(choices[i].callback);
		list.append('<li></li>');
		
		$(list.children()[i]).append(link);
	}
}

function finishChoice(message) {
	if(message == undefined || message == null || message == '') {
		clearText();
	} else {
		showText(message);
	}
	
	GAME_MODE = MODE_NAV;
}

function clearText() {
	getCommandPanel().html('');
}