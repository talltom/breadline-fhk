//main.js - breadline-fhk main JavaScript file.

// Create toggle switch for user location
$.fn.bootstrapSwitch.defaults.size = 'mini';
$("[name='my-location']").bootstrapSwitch();

eventbrite.getUserToken(function(){
  // Get events from Eventbrite
  eventbrite.getEvents(function(data){
    eventbrite.events = data.events;
    for (var i = 0; i < eventbrite.events.length; i++){
      $('#authSuccessSelectPicker, #sidebarSelectPicker').append("<option>"+eventbrite.events[i].name.html+"</option>");
    }
  });
});

// Load layers per user event selection
$(document).on('change','#authSuccessModal, #sidebarSelectPicker', function(e){
  if ($('#authSuccessModal').is(':visible')){
    $('#sidebarSelectPicker').selectpicker('val', $('#authSuccessSelectPicker').val());
    $('#authSuccessModal').modal('hide');
  }
  $('#event_title').empty();
  $('#event_title').html('<h5><a href="'+eventbrite.events[e.target.selectedIndex-1].url+'" target="_blank">'+eventbrite.events[e.target.selectedIndex-1].name.html+'</a></h5>');
  if (e.target.selectedIndex > 0){
      //Possible caching check for data already stored, not implemented at this time
      /*if (!eventbrite.events[e.target.selectedIndex-1].tickets){
        console.log('fired');
      }*/
      eventbrite.getEventTickets(eventbrite.events[e.target.selectedIndex-1].id, function(ticket_classes){
      eventbrite.events[e.target.selectedIndex-1].tickets = {};
      eventbrite.events[e.target.selectedIndex-1].tickets['available'] = 0;
      eventbrite.events[e.target.selectedIndex-1].tickets['unavailable'] = 0;
      for (var i = 0; i < ticket_classes.length; i++){
        eventbrite.events[e.target.selectedIndex-1].tickets[ticket_classes[i].id] = ticket_classes[i];
        for (var j = 0; j < map.data.bakeries.features.length-1; j++) {
          if (map.data.bakeries.features[j].properties.name === ticket_classes[i].name){
            map.data.bakeries.features[j].properties.id = ticket_classes[i].id;
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
$('#userlocationToggle').on('switchChange.bootstrapSwitch', function(event, state) {
  map.userLocation(state);
});

// Toggle user location by default.
map.userLocation(true);
$('input[name="my-location"]').bootstrapSwitch('state', true, true);

var currentBakery = null;

// UI spec for bakery modal
_bakeryModal = function(bakery){
  currentBakery = bakery;
  // Bakery details
  $('#bakeryModalText').empty();
  $('#bakeryModalBtn').empty();
  $('#stationMTR').empty();
  var name = bakery.target.feature.properties.name
  var mtr = bakery.target.feature.properties.nearest_mtr.properties.Station;
  $('#bakeryModalText').prepend('<h3>'+name.replace('-', '<BR>-')+'</h3>');
  $('#stationMTR').append('Nearest MTR Station: '+mtr);
  if (bakery.target.feature.properties.state === 'AVAILABLE'){
    $('#bakeryModalBtn').prepend('<a class="btn btn-warning" href="'+eventbrite.events[$('#authSuccessSelectPicker, #sidebarSelectPicker')[0].selectedIndex-1].url+'#remaining_quant_'+bakery.target.feature.properties.id+'_None'+'" target="_blank">Register Now on Eventbrite</a>');
  }
  else {
    $('#bakeryModalBtn').prepend('<p>Not available</p>');
  }
  $('#bakeryModal').modal('show');
}

// Routing options
$('#routingBtn').on('click', function(e){
  // Open sidebar if closed
  if ($("#wrapper").css('padding-left') !== "250px"){
    $("#wrapper").toggleClass("toggled");
  }
// Disable geo-location check
/*  if ($.isEmptyObject(map.data.user_location)){
    alert('Please first enable location in the toolbar');
  }
*/
    if (map.routingControl){
      map.routingControl.getPlan().setWaypoints([]);
      map.leafletMap.removeControl(map.routingControl);
      $('#routingTitle').empty();
    }
    $("#routingPanel").removeClass('hidden');
    $('#routingTitle').append('<h5>Suggested Route - '+$('#routingSelectpicker option:selected').text()+'</h5>')
    $('#routingText').append('<p>'+currentBakery.target.feature.properties.name+'</p>');
    var mtr_coords = currentBakery.target.feature.properties.nearest_mtr.geometry.coordinates;
    map.routing(L.latLng(mtr_coords[1], mtr_coords[0]), currentBakery.latlng, $('#routingSelectpicker').val());
  $('#bakeryModal').modal('hide');
});

// UI spec for bakery modal
_dropoffModal = function(e){
  currentBakery = e;
  $('#bakeryModalText').empty();
  $('#bakeryModalBtn').empty();
  $('#bakeryModalText').prepend('<h3>Drop Off Location</h3><p>'+e.target.feature.properties.name+'</p>');
  $('#bakeryModal').modal('show');
}

// Close routing
$('.clickable').on('click',function(){
    map.routingControl.getPlan().setWaypoints([]);
    map.leafletMap.removeControl(map.routingControl);
    //var effect = $(this).data('effect');
    //    $(this).closest('.panel')[effect]();
    $("#routingPanel").addClass('hidden');
});
