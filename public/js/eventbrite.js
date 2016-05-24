//eventbrite.js - JavaScript for BreadLine FHK App EventBrite Intergration
//requires JQuery

var eventbrite = {
  config : {
    key: "LGRGVEBIBCQZ4YW7KD", //Eventbrite API key for this app
    token : null, //Eventbrite API token *secret*
    organizerID : "2684124262", //Eventbrite organizer ID (Feeding Hong Kong)
    max_ticket_pages: 2
  },
  events : {}
};

eventbrite.getUserToken = function(callback){
  if (eventbrite.config.token === null){
    if (window.location.hash){
      eventbrite.config.token = $.url('#access_token');
      callback();
    }
    else {
      $('#authmodal > .modal-body').append('<a class="btn btn-success" href="https://www.eventbrite.com/oauth/authorize?response_type=token&client_id='+eventbrite.config.key+'">Login to Eventbrite ></a>');
      $('#authModal').modal('show');
    }
  }
}

eventbrite.getEvents = function(callback){
    $.getJSON("https://www.eventbriteapi.com/v3/events/search/?organizer.id="+eventbrite.config.organizerID+"&token="+eventbrite.config.token, function(data, status){
        callback(data);
      })
      .fail(function(){
        console.log("[data.getEvents] Error fetching Evenbrite event data");
    });
};

eventbrite.getEventTickets = function(eventID, callback){
    var eventTickets = [];
    var ajaxCalls = [];
    var counter = 0;

    var checkComplete = function(counter){
      if (counter === eventbrite.config.max_ticket_pages){
        callback(eventTickets);
      }
    }

    for (var i = 1; i <= eventbrite.config.max_ticket_pages; i++){
        $.getJSON("https://www.eventbriteapi.com/v3/events/"+eventID+"/ticket_classes/?token="+eventbrite.config.token+"&page="+i, function(data){
          eventTickets = $.merge(eventTickets, data.ticket_classes);
          counter += 1;
          checkComplete(counter);
        })
        .fail(function(){
          console.log("[data.getEventTickets] Error fetching Eventbrite event ticket data")
          counter += 1;
          checkComplete(counter);
        })
    }
};
