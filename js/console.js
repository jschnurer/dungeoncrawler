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

function showTextWithCallback(message, continueFunction) {
	getCommandPanel().html('<p>' + message.replace(/\[br\]/g, '<br />') + '</p>');
	var continueLink = $('<a class="spaceToContinue">Press [SPACE] to continue</a>');
	continueLink.click(continueFunction);
	getCommandPanel().append(continueLink);
	GAME_MODE = MODE_CONTINUE;
	continueCallback = continueFunction;
}

function showText(message, resumeGameMode, blocking) {
	continueCallback = null;
	getCommandPanel().html('<p>' + message.replace(/\[br\]/g, '<br />') + '</p>');
	if(blocking == undefined || blocking == true) {
		var continueLink = $('<a class="spaceToContinue" data-resume-game-mode="'+(resumeGameMode == undefined ? MODE_NAV : resumeGameMode)+'">Press [SPACE] to continue</a>');
		continueLink.click(function () { 
			var resumeMode = $(this).attr('data-resume-game-mode');
			
			if(resumeMode != undefined) {
				GAME_MODE = resumeMode;
			}
			
			clearText();
		});
		getCommandPanel().append(continueLink);
		GAME_MODE = MODE_CONTINUE;
	}
}

function showChoices(message, choices) {
	clearText();
	
	GAME_MODE = MODE_CHOICE;
	
	var list = getCommandPanel().append('<p>' + message.replace(/\[br\]/g, '<br />') + '</p>').append('<ol></ol>').find('ol');
	
	for(var i = 0; i < choices.length; i++) {
		var link = $('<a id="choice' + (i+1) + '">' + choices[i].text + '</a>');
		link.click(choices[i].callback);
		list.append('<li></li>');
		
		$(list.children()[i]).append(link);
	}
}

function finishChoice(message) {
	if(message == undefined || message == null || message == '') {
		clearText();
		GAME_MODE = MODE_NAV;
	} else {
		showText(message);
	}
}

function clearText() {
	getCommandPanel().children('a').remove();
	getCommandPanel().html('');
}

function handleContinueInput(e) {
	if(e.which == KEY_SPACE) {
		getCommandPanel().children('a.spaceToContinue').click();
		e.preventDefault();
		return;
	}
}