//main.js - breadline-fhk main JavaScript file.

// Create toggle switch for user location
$.fn.bootstrapSwitch.defaults.size = 'mini';
$("[name='my-location']").bootstrapSwitch();

// Get events from Eventbrite
eventbrite.getEvents(function(data){
  eventbrite.events = data.events;
  for (var i = 0; i < eventbrite.events.length; i++){
    $('.selectpicker').append("<option>"+eventbrite.events[i].name.html+"</option>");
  }
});

// Load layers per user event selection
$(document).on('change','.selectpicker', function(e){
  $('#event_title').empty();
  $('#event_title').html('<h5><a href="'+eventbrite.events[e.target.selectedIndex-1].url+'" target="_blank">'+eventbrite.events[e.target.selectedIndex-1].name.html+'</a></h5>');
  //if data doesn't exist already?
  if (e.target.selectedIndex > 0){
      eventbrite.getEventTickets(eventbrite.events[e.target.selectedIndex-1].id, function(ticket_classes){
      eventbrite.events[e.target.selectedIndex-1].tickets = {};
      eventbrite.events[e.target.selectedIndex-1].tickets['available'] = 0;
      eventbrite.events[e.target.selectedIndex-1].tickets['unavailable'] = 0;
      for (var i = 0; i < ticket_classes.length; i++){
        eventbrite.events[e.target.selectedIndex-1].tickets[ticket_classes[i].id] = ticket_classes[i];
        for (var j = 0; j < map.data.bakeries.features.length-1; j++) {
          if (map.data.bakeries.features[j].properties.name === ticket_classes[i].name){
            map.data.bakeries.features[j].properties['state'] = ticket_classes[i].on_sale_status;
          }
        }
        // Count number of available bakeries
        switch(ticket_classes[i].on_sale_status){
          case "AVAILABLE":
            eventbrite.events[e.target.selectedIndex-1].tickets.available += 1;
            break;
          case "SOLD_OUT":
          eventbrite.events[e.target.selectedIndex-1].tickets.unavailable +=1;
        }
      }
      // Update UI
      $("#labelAvailable").text(eventbrite.events[e.target.selectedIndex-1].tickets.available+" ");
      $("#labelUnavailable").text(eventbrite.events[e.target.selectedIndex-1].tickets.unavailable+" ");
      map.layers.bakeries.clearLayers();
      map.layers.bakeries.addData(map.data.bakeries).addTo(map.leafletMap);
    });
  }
});

// Map
L.Icon.Default.imagePath = 'images/'
$("#map").css("height", $(window).height());

map.initialise();
map.addDropOffLayer();
map.prepareBakeries();

//Get initial map width
var initialWidth = $("#map").width();

// Toggle UI
$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
    setTimeout(function(){ map.leafletMap.invalidateSize()}, 400);
});

// Dynamic map height
$(window).on('resize', function(){
  $("#map").css("height", $(window).height());
});

// Enable user location UI
$('input[name="my-location"]').on('switchChange.bootstrapSwitch', function(event, state) {
  map.userLocation(state);
});

// UI spec for bakery modal
_bakeryModal = function(e){
  var name = e.target.feature.properties.name
  $('#bakeryModalText').empty();
  $('#bakeryModalText').prepend(name.replace('-', '<BR>-'));
  $('#bakeryModal').modal('show');
}
