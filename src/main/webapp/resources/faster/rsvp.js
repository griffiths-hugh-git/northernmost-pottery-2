/*
 * A slight modification of the original Faster code, this version removes the progress bar, and adds a 
 * callback function which fires when the text is finished reading.
 * 
 * Hugh.
 */

function Rsvp(text, targetDiv, settings, viewerTa, callback) {
	this._text = text;
	this._targetDiv = targetDiv;
	this._viewerTa = viewerTa;
	this.changeSettings(settings);
	this._initializeFromText(text);
	this._nextWordIndex = 0;
	this._curTimeout = null;
	this._playing = false;
	this._destroyed = false;
	this._callback = callback;
}
Rsvp.fn = Rsvp.prototype;
Rsvp.fn._initializeFromText = function(text) {
	var regex = new RegExp("([^\\s]+)\\s+", "mg");
	this._words = [];
	this._wordPositions = [];
	var match = null;
	var i = 0;
	var lastLastIndex = 0;
	while ((match = regex.exec(text)) != null) {
		this._words[i] = match[1];
		this._wordPositions[i] = lastLastIndex;
		lastLastIndex = regex.lastIndex;
		i++;
	}
	this._words[i] = text.substring(lastLastIndex);
	this._wordPositions[i] = lastLastIndex;
	i++;
	this._wordPositions[i] = text.length - 1;
}
Rsvp.fn.destroy = function() {
	this.pause();
	this._destroyed = true;
}
Rsvp.fn.changeSettings = function(settings) {
	this._numLines = settings.numLines;
	this._wordsPerLine = settings.wordsPerLine;
	this._groupsPerMinute = settings.groupsPerMinute;
	this._wordsPerGroup = this._numLines * this._wordsPerLine;
	this._msPerGroup = 60 * 1000 / this._groupsPerMinute;
}
Rsvp.fn.incrementSpeed = function(wpm_plus) {
	this._groupsPerMinute += wpm_plus;
	if (this._groupsPerMinute < 1) {
		alert("Minimum at 1 group per minute");
		this._groupsPerMinute = 1;
	}
	this._msPerGroup = 60 * 1000 / this._groupsPerMinute;
	return this._groupsPerMinute;
}
Rsvp.fn.start = function() {
	this._playing = true;
	this.nextFrame();
}
Rsvp.fn.nextFrame = function() {
	this.showTextRange();
	var pos = (this._nextWordIndex - this._wordsPerGroup)
			/ (this._words.length - this._wordsPerGroup) * 200;
	if (this._playing && this._nextWordIndex < this._words.length) {
		this.setTimeout();
	} else {
		this._callback();
	}
}
Rsvp.fn.moveToPercentage = function(percent) {
	var startWord = Math.floor(percent * this._words.length);
	startWord -= startWord % this._wordsPerGroup;
	this.showTextRange(startWord);
}
Rsvp.fn.showTextRange = function(firstWordIndex) {
	if (firstWordIndex === undefined)
		firstWordIndex = this._nextWordIndex;
	this._nextWordIndex = firstWordIndex;
	var resHtml = "";
	var firstWordBeginPos = this._wordPositions[firstWordIndex];
	for ( var i = 0; i < this._numLines; i++) {
		for ( var j = 0; j < this._wordsPerLine; j++) {
			if (this._nextWordIndex >= this._words.length) {
				this._playing = false;
				break;
			}
			resHtml += this._words[this._nextWordIndex] + " ";
			this._nextWordIndex++;
		}
		if (this._nextWordIndex >= this._words.length) {
			this._playing = false;
			break;
		}
		resHtml += "<br/>";
	}
	var lastWordEndPos = this._wordPositions[this._nextWordIndex];
	this.selectRangeInViewer(firstWordBeginPos, lastWordEndPos);
	$(this._targetDiv).html(resHtml);
}
Rsvp.fn.setTimeout = function() {
	if (this._destroyed)
		return;
	if (this._curTimeout)
		clearTimeout(this._curTimeout);
	var self = this;
	this._curTimeout = setTimeout(function() {
		self.nextFrame();
	}, this._msPerGroup);
}
Rsvp.fn.pause = function() {
	clearTimeout(this._curTimeout);
	this._playing = false;
}
Rsvp.fn.playOrResume = function() {
	this._playing = true;
	this.setTimeout();
}
Rsvp.fn.rewind = function() {
	this._nextWordIndex = 0;
	this.nextFrame();
}
Rsvp.fn.selectRangeInViewer = function(start, end) {
	var ta = $(this._viewerTa).get(0);
	if (!$(this._viewerTa).is(":visible")) {
		return;
	}
	if (ta.createTextRange) {
		var oRange = ta.createTextRange();
		oRange.collapse(true);
		oRange.moveStart("character", start);
		oRange.moveEnd("character", end - start);
		oRange.select();
	} else if (ta.setSelectionRange) {
		ta.setSelectionRange(start, start + 1);
		if (window.KeyEvent) {
			var ev = document.createEvent('KeyEvents');
			ev.initKeyEvent('keypress', true, true, window, false, false,
					false, false, 0, ta.value.charCodeAt(start));
			ta.dispatchEvent(ev);
		}
		ta.setSelectionRange(start, end);
	}
}
