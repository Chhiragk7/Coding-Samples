jQuery(document).ready(function($){

    if($(window).width()<1024){
        //centering text when <1024 pixels
        $('.cd-image-container .cd-resize-img .analytics h2').removeClass('analytics-h2').css({'text-align': 'center'});
        $('.cd-image-container .cd-resize-img .analytics .analytics-content').removeClass('analytics-content-fixed').css({'text-align': 'left'});
    }

    else{
         //clicking on marketplace section reveal marketplace
        $(".marketplace").click(function(){
            $(".cd-image-container .cd-resize-img").animate({width: '2.25%'});
            $(".cd-image-container .cd-handle").animate({left: '2.25%'});
        });
        //clicking on analytics section reveal analytics
        $(".analytics").click(function(){
            $(".cd-image-container .cd-resize-img").animate({width: '97.7%'});
            $(".cd-image-container .cd-handle").animate({left: '97.7%'});
        });
    }
    //check if the .cd-image-container is in the viewport 
    //if yes, animate it
    checkPosition($('.cd-image-container'));
    $(window).on('scroll', function(){
        checkPosition($('.cd-image-container'));
    });
    
    //make the .cd-handle element draggable and modify .cd-resize-img width according to its position
    $('.cd-image-container').each(function(){
        var actual = $(this);
        drags(actual.find('.cd-handle'), actual.find('.cd-resize-img'), actual, actual.find('.cd-image-label[data-type="original"]'), actual.find('.cd-image-label[data-type="modified"]'));
    });
});

$(window).resize(function(){
  if($(window).width()<1024){
    $('.slick-list').removeClass('draggable');
  }
});

function goToScoreCard(websiteDomain, idrssd) {
    $("#searchbar-website-domain").val(websiteDomain);
    $("#searchbar-idrssd").val(idrssd);
    $("#search-bank").submit();
}

function checkPosition(container) {
  container.each(function(){
    var $actualContainer = $(this);
    if( $(window).scrollTop() + $(window).height()*0.5 > $actualContainer.offset().top) {
      $actualContainer.addClass('is-visible');
    }
  });
}

//draggable funtionality - credits to http://css-tricks.com/snippets/jquery/draggable-without-jquery-ui/
function drags(dragElement, resizeElement, container, labelContainer, labelResizeElement) {
  dragElement.on("mousedown vmousedown", function(e) {
    dragElement.addClass('draggable');
    resizeElement.addClass('resizable');

    var dragWidth = dragElement.outerWidth();
    var xPosition = dragElement.offset().left + dragWidth - e.pageX;
    var containerOffset = container.offset().left;
    var containerWidth = container.outerWidth();
    var minLeft = containerOffset + 10;
    var maxLeft = containerOffset + containerWidth - dragWidth - 10;
    
    dragElement.parents().on("mousemove vmousemove", function(e) {
      leftValue = e.pageX + xPosition - dragWidth;
      
      //constrain the draggable element to move inside his container
      if(leftValue < minLeft ) {
        leftValue = minLeft;
      } else if ( leftValue > maxLeft) {
        leftValue = maxLeft;
      }

      widthValue = (leftValue + dragWidth/2 - containerOffset)*100/containerWidth+'%';

      $('.draggable').css('left', widthValue).on("mouseup vmouseup", function() {
        position_mouse_up = widthValue;
        $(this).removeClass('draggable');
        resizeElement.removeClass('resizable');
      });

      $('.resizable').css('width', widthValue); 
      
    }).on("mouseup vmouseup", function(e){
      dragElement.removeClass('draggable');
      resizeElement.removeClass('resizable');
    });
    e.preventDefault();
  }).on("mouseup vmouseup", function(e) {
    dragElement.removeClass('draggable');
    resizeElement.removeClass('resizable');
  });
}