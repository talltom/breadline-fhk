# Breadline
Breadline is a suite of geospatial web applications produced as part of [Hong Kong FoodWorks](http://hkfoodworks.com/).

## breadline-fhk
Map of bakeries in Feeding Hong Kong [Bread Run](http://feedinghk.org/bread-run/) events, and lists their availability for volunteer collection according to [Eventbrite](http://www.eventbrite.hk/o/feeding-hong-kong-2684124262) tickets for each Bread Run event.

### App
- server: NodeJS + Express
- web: Bootstrap + JQuery + Leaflet
- client side files stored in `public`

#### Install using NPM
To install based on `package.json` do:

 `npm install`

#### Configure
Edit `eventbrite.config.token` parameter in `public/js/eventbrite.js` with appropriate token.
Without token, the app will run but no bakeries will be available on the map.

#### Run
`node app.js`

### Data
- `public/data/fhk_bakeries.{csv | geojson}` - pickup locations
- `public/data/drop_off.geojson` - drop off location
- Geolocation of Bakeries is very coarse
- ~~Chrome 50+ requires HTTPS for user's geolocation~~ (we have https)

### License
Open Source. TBC.

### To do
1. ~~Eventbrite pagination~~
2. ~~Eventbrite functions - check if data exists before calling~~
3. Check Geocode bakery addresses
4. ~~Map attribution~~
5. ~~Add event details + link~~
6. ~~Eventbrite User Authentication~~
7. Add License file
