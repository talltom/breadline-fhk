// Join nearest MTR station to each Bakery;

var nearest = require('@turf/nearest');
var fs = require('fs');

var bakeries = JSON.parse(fs.readFileSync('../public/data/fhk_bakeries_geocoded.geojson'));
var mtr_locations = JSON.parse(fs.readFileSync('../public/data/mtr_locations.geojson'));

for (bakery in bakeries.features){
  var local = nearest(bakeries.features[bakery], mtr_locations);
  bakeries.features[bakery].properties["nearest_mtr"] = local;
}
//console.log(JSON.stringify(bakeries));
fs.writeFileSync('../public/data/fhk_bakeries_geocoded_with_mtr.geojson', JSON.stringify(bakeries));
