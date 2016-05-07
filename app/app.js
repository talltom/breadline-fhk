/* breadline-fhk - Map of bakeries in Feeding Hong Kong Breadrun events
 * app.js - main NodeJS application
 * v0.0.1
 * Tomas Holderness <tomasholderness@gmail.com> | <@iHolderness>
 * Distributed as Open Source
*/

// dependencies
var express = require('express');
var app = express();

// static
app.use(express.static('public'));

// listen
app.listen(3000, function () {
  console.log('breadline-fhk app running on port 3000');
});
