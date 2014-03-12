var rsvpInstance;

function extractSettings() {
	return {
		'numLines' : 1,
		'wordsPerLine' : 1,
		'groupsPerMinute' : parseInt($('#groupsPerMinute').val())
	};
}
// function changeSettingsButtonCallback(){var
// newSettings=extractSettings();if($("#display").data('rsvpInstance'))
// $("#display").data('rsvpInstance').changeSettings(newSettings);recomputeWpm();}
// function recomputeWpm(){var
// newSettings=extractSettings();$("#wordsPerMinute").val(newSettings.numLines*
// newSettings.wordsPerLine*
// newSettings.groupsPerMinute);}
// function _incrementSpeed(wpm_plus){var
// rsvpInstance=$("#display").data('rsvpInstance');if(rsvpInstance){newGpm=rsvpInstance.incrementSpeed(wpm_plus);$('#groupsPerMinute').val(newGpm);recomputeWpm();}}
// function startNewPlayback(){showtab(2);var
// oldInstance=$("#display").data('rsvpInstance');if(oldInstance){oldInstance.destroy();}
// function handleSlideEvent(e,ui){var newValue=ui.value;var
// rsvpInstance=$("#display").data('rsvpInstance');if(rsvpInstance){if(!rsvpInstance.sliderEventDisabled){rsvpInstance.moveToPercentage(newValue/200);}}}
// function playButtonCallback(){var
// rsvpInstance=$("#display").data('rsvpInstance');if(rsvpInstance){rsvpInstance.playOrResume();}}
// function pauseButtonCallback(){var
// rsvpInstance=$("#display").data('rsvpInstance');if(rsvpInstance){rsvpInstance.pause();}}
// function rewindButtonCallback(){var
// rsvpInstance=$("#display").data('rsvpInstance');if(rsvpInstance){rsvpInstance.rewind();}}
// $(function(){$('#slider_div').slider({min:0,max:200,startValue:0,slide:handleSlideEvent});});function
// _hideAllTabs(tabnum){$('#textinput_tab a').attr('id','');$('#playback_tab
// a').attr('id','');$('#info_tab
// a').attr('id','');$('#textinput_pane').hide();$('#playback_pane').hide();$('#info_pane').hide();}
// function _getTab(tabnum){switch(tabnum){case 1:return $('#textinput_tab
// a');case 2:return $('#playback_tab a');case 3:return $('#info_tab a');}}
// function _getPane(tabnum){switch(tabnum){case 1:return
// $('#textinput_pane');case 2:return $('#playback_pane');case 3:return
// $('#info_pane');}}
// function _showOneTab(tabnum){var tab=_getTab(tabnum);var
// pane=_getPane(tabnum);tab.attr('id','current');pane.show();}
// function showtab(tabnum){_hideAllTabs();_showOneTab(tabnum);}
// function
// _keyupHandler(event){keycode=event.keyCode;if(keycode==38){_incrementSpeed(10)}else
// if(keycode==40){_incrementSpeed(-10)}
// return false;}
// function
// _setBgColor(color){$("#display").css("background-color","#"+color);$("#viewer_ta").css("background-color","#"+color);}
// function
// _setFgColor(color){$("#display").css("color","#"+color);$("#viewer_ta").css("color","#"+color);}
// $(function(){var
// qs=window.location.search;if(qs&&qs.length>1){$('#input_text_ta').val(decodeURIComponent(qs.substring(1)));}
// showtab(1);$(".playback_control_a img")
// .mouseover(function(){$(this).css('background-color','#888');})
// .mouseout(function(){$(this).css('background-color','#aaa');});$(document).keyup(_keyupHandler);$("#bg_color").change(function(){_setBgColor($("#bg_color").val());});$("#text_color").change(function(){_setFgColor($("#text_color").val());});$("#viewer_ta").keydown(_keyupHandler);});

function newRsvpPlayer(){
	if (rsvpInstance!=null){
		rsvpInstance.destroy();
	}

	var text = $("#viewer_ta").text();
	rsvpInstance = new Rsvp(text, $('#display'),
			extractSettings(), $('#slider_div'),
			 advanceParagraph);
	$("#display").data('rsvpInstance', rsvpInstance);
}

function startRsvpPlayer(){
	if (rsvpInstance == null) {
		newRsvpPlayer();
		rsvpInstance.start();
	}
	else {
		rsvpInstance.playOrResume();
	}
}

function pauseRsvpPlayer(){
	if (rsvpInstance!=null){
		rsvpInstance.pause();
	}
}

function rewindRsvpPlayer(){
	if (rsvpInstance!=null){
		rsvpInstance.rewind();
	}
}

$(document).ready(
		function() {
			$("#play").click(
					function() {
						startRsvpPlayer();
					});
			
			$("#pause").click(
					function() {
						pauseRsvpPlayer();						
					});
			
			$("#rewind").click(
					function() {
						rewindRsvpPlayer();						
					});
		});
