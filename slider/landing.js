$(document).ready(function(){
	$(".tt-menu").hide();
	var document_height = $(document).height();
	var body_height = $("body").height();
  	var footer_position = (document_height - $('#footer').offset().top)/2;
  	var footer_position_mobile = (body_height + $(".analytics-slick-carousel").height() - $('#footer').offset().top)/2;
  	
  	if($(window).width()<641){
  		$("#search-box").on('keypress', function(){
	  		$("body, html").animate({scrollTop: $('#footer').offset().top });
			$(".tt-menu").show();
			$(".tt-menu").height(document_height);
		});
  	}
	if($(window).width()>641 && $(window).width()<1024){
		$(".search-bar-holder-position").css({"top":footer_position_mobile});
		$("#search-box").on('keypress', function(){
	  		slide_to_top(document_height);
		});
	}
	else{
		$(".search-bar-holder-position").css({"top":footer_position});
		$("#search-box").on('keypress', function(){
	  		slide_to_top(document_height);
		});
	}
});

function slide_to_top(container_height){
	$(".search-bar-holder-position").animate({"top": 50});
	$("body, html").animate({scrollTop: $('#footer').offset().top });
	$(".tt-menu").show();
	$(".tt-menu").height(container_height);
}