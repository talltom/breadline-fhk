//map.js - JavaScript for Breadline FHK App Leaflet map
// requires LeafletJS

var map = {
  config : {
    div: 'map',
    mapbox_access_token: 'pk.eyJ1IjoicGV0YWpha2FydGEiLCJhIjoiTExKVVZ5TSJ9.IFf5jeFKz2iwMpBi5N3kUg',
    defaultCentre: [22.3, 114.2],
    defaultZoom: 13,
    creationOptions: {
      zoomControl: false,
      attributionControl: false
    }
  },
  layers : {},
  data : {
    bakeries :{}
  }
};

map.initialise = function(){
  // Initialise map
  map.leafletMap = L.map(map.config.div, map.config.creationOptions);

  // Set view HK
  map.leafletMap.setView(map.config.defaultCentre, map.config.defaultZoom);

  // Zoom control
  new L.Control.Zoom({ position: 'topright'}).addTo(map.leafletMap);

  // Scale
  L.control.scale({position: 'bottomleft', imperial:false}).addTo(map.leafletMap);

  // Tile layers
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token='+map.config.mapbox_access_token, {
    maxZoom: 18,
    id: 'mapbox.outdoors'
  }).addTo(map.leafletMap);

  // Side menu-toggle
  map.info = L.control({position:'topleft'});

  map.info.onAdd = function() {
      this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
      this._div.innerHTML = '<a href="#menu-toggle" class="btn btn-default" id="menu-toggle" style="padding-left:6px;padding-right:6px;"><span class="glyphicon glyphicon-info-sign" aria-hidden="true" style="font-size:28px;color:#e51843;vertical-align:middle;"></span></a>';
      return this._div;
  };
  map.info.addTo(map.leafletMap);

  // User location layer placeholder
  map.layers.mylocation = new L.FeatureGroup();
};

map.addDropOffLayer = function(){
  // Add location of drop off point to the map
  map.layers.dropoff  = L.geoJson(null, {
    pointToLayer: function(feature, latlng){
      return  L.marker(latlng, {icon:L.divIcon({className: 'div-icon-dropoff', html:'<p><span class="glyphicon glyphicon-record" aria-hidden="true" style="color:#ff5900;font-size:26px;"></span></p>', popupAnchor:[5,0]})});
    }
  }).addTo(map.leafletMap);
  // Get data
  $.getJSON('data/drop_off.geojson', function(data){
    map.layers.dropoff.addData(data);
  });
};

map.prepareBakeries = function(){
  // Prepare locations of bakeries for the map, but don't load into leaflet
  map.layers.bakeries  = L.geoJson(null, {
    pointToLayer: function(feature, latlng){
      switch (feature.properties.state) {
        case "AVAILABLE":
          return L.circleMarker(latlng, {radius:5, stroke:true, color:'#FFF', weight:2, fillColor:'#e51843',fillOpacity:1});
        default:
          return L.circleMarker(latlng, {radius:5, stroke:true, color:'#FFF', weight:2, fillColor:'grey',fillOpacity:1});
      }
    }
  })
  // Get data but return to callback instead of adding to map.layers.bakeries
  $.getJSON('data/fhk_bakeries_geocoded.geojson', function(data){
    map.data.bakeries = data;
  });
};

map.userLocation = function(toggle){
  if (toggle === true){
    map.leafletMap.locate({setView: true, maxZoom: 14});
    function onLocationFound(e) {
        var radius = e.accuracy / 2;
        if (radius > 6){
          map.layers.mylocation.addLayer(L.circle(e.latlng, radius, {stroke:false}));
        }
        map.layers.mylocation.addLayer(L.circleMarker(e.latlng, {radius:6, stroke:false, fillColor:'#337ab7',fillOpacity:1}));

        map.layers.mylocation.addTo(map.leafletMap);
      }
      map.leafletMap.on('locationfound', onLocationFound);
    }
  else {
    map.leafletMap.setView(map.config.defaultCentre, map.config.defaultZoom);
    map.layers.mylocation.clearLayers();
  }
};
