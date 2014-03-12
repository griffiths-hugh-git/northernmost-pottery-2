var index=1;

$(document).ready(function(){
	// Get HTML page
	$("#submit").click(function(){
//		var url=$("#url").val().replace("http://", "http://www.corsproxy.com/");
		var url= "http://localhost:8080/rest/request?url="+encodeURI($("#url").val());
		if (url!=null){
			$.get(url, function(data, textStatus, jqXHR){
			    insertText(data);
			  })
			  .fail(function(jqXHR, textStatus, errorThrown) {
				  alert( "error : "+errorThrown);
			  });
			
			highlightParagraph();
		}
	});
	
	$( document ).keypress(function(event) {
		var key =  String.fromCharCode(event.which);
		if (key=='z'){
			pausePlaying();
			decrementParagraph();
		} else if (key=='x'){
			startOrResumePlaying();
		} else if (key=='c'){
			pausePlaying();
		} else if (key=='v'){
			pausePlaying();
			incrementParagraph();
		} else if (key=='d'){
			rewindPlaying()
		}
		
		});
});

function insertText(data){
	var bodyRE=new RegExp("<p>(.|\r|\n)*?</p>", "gm");
	var match;
	$("#full-text").empty();
	while ((match= bodyRE.exec(data))!=null){
		$("#full-text").append(match[0]);
	}
	
	highlightParagraph();
}

function startOrResumePlaying(){
	startRsvpPlayer();
}

function pausePlaying(){
	pauseRsvpPlayer();
}

function rewindPlaying(){
	newRsvpPlayer();
}

function advanceParagraph(){
	incrementParagraph();
	
	// Index is 1 if we've wrapped back to the start.
	if (index!=1){
		setTimeout(startRsvpPlayer(),100);
	}
}

function incrementParagraph(){
	unhighlightParagraph();
	index=index+1;
	if (index>$("p").length){
		index=1;
	}
	
	highlightParagraph();
}

function decrementParagraph(){
	unhighlightParagraph();
	index=index-1;
	if (index<=0){
		index=$("p").length;
	}
	
	highlightParagraph();
}

function highlightParagraph(){
	$("p:eq("+index+")").css("background-color", "#FF0318");
	var text = $("p:eq("+index+")").text();
	$("#viewer_ta").text(text);
	newRsvpPlayer();
}

function unhighlightParagraph(){
	$("p:eq("+index+")").css("background-color", "#FFFFFF");
}