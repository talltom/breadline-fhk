//eventbrite.js - JavaScript for BreadLine FHK App EventBrite Intergration
//requires JQuery to be loaded

var eventbrite = {
  config : {
    token : "GSAVA4B45GPLIPWWP6D7", //Eventbrite API token *secret*
    organizerID : "2684124262" //Eventbrite organizer ID
  },
  events : {}
};

eventbrite.getEvents = function(callback){
  $.getJSON("https://www.eventbriteapi.com/v3/events/search/?organizer.id="+eventbrite.config.organizerID+"&token="+eventbrite.config.token, function(data){
    callback(data);
  })
  .fail(function(){
    console.log("[data.getEvents] Error fetching Evenbrite event data");
  });
};

eventbrite.getEventTickets = function(eventID, callback){
  $.getJSON("https://www.eventbriteapi.com/v3/events/"+eventID+"/ticket_classes/?token="+eventbrite.config.token, function(data){
    console.log(data);
    callback(data);
  })
  .fail(function(){
    console.log("[data.getEventTickets] Error fetching Eventbrite event ticket data")
  });
};
