function sendDataToExtension(key, value) {
  var dataObj = {"key":key, "value":value};
  var storeEvent = new CustomEvent('TqRedminePlusStore', {"detail":dataObj});
  document.dispatchEvent(storeEvent);
}

jQuery(document).ready(function($) {
  if ($("#taskboard").length) {
    var tooltipData = {};

    $('.story_tooltip').each(function(){
      var $tooltip = $(this),
        storyId = $tooltip.find('a').text();

      tooltipData[storyId] = $tooltip.find('.tooltip_text').html();
    });

    // The first argument is used as event name to be triggered in the extension
    // JS.
    sendDataToExtension('taskboardTooltipData', tooltipData);
  }
});
