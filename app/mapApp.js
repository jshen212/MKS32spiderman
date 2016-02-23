angular.module('mapsApp', [])
.controller('MapCtrl', function ($scope, MapHelpers) {
  MapHelpers.initMap();
  $scope.coffeeShops = [];

  // wait for coffee shops to populate.
  setTimeout(function(){
    for(var i = 0; i < MapHelpers.coffeeShops.length; i++){
      MapHelpers.coffeeShops[i].shopImage = MapHelpers.coffeeShops[i].photos[0].getUrl({'maxWidth': 500, 'maxHeight': 500});
      // MapHelpers.coffeeShops[i].open = false;
      $scope.coffeeShops.push(MapHelpers.coffeeShops[i]);
    }
    // without digest, ng-repeat will not be able to read the updated coffeeShops array on the scope
    $scope.$digest();
    console.log('!!Line 7: ', $scope.coffeeShops);
  }, 1150);

})
.factory('MapHelpers', function(){

  var map;
  var infowindow;
  var coffeeShops = [];

  function initMap(lat, lng) {
    lat = lat || 34.0219;
    lng = lng || -118.4814;
    var santaMonica = {lat: lat, lng: lng};


    map = new google.maps.Map(document.getElementById('map'), {
      center: santaMonica,
      zoom: 14
    });

    // getUserCurrentLocation(map);

    infowindow = new google.maps.InfoWindow();

    var service = new google.maps.places.PlacesService(map);
    service.textSearch({
      location: santaMonica,
      radius: 2000,
      types: ['cafe', 'restaurant', 'food', 'store', 'establishment', 'meal_takeaway', 'point_of_interest'],
      query: ['coffee']
    }, callback);
  }

  function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }
      coffeeShops = results;
      // console.log('++line42', coffeeShops);
    }
  }

  function createMarker(place) {

    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location
    });

    var photo;
    // var icon = place.icon;
    var openNow;

    if(place.photos){
      photo = place.photos[0].getUrl({'maxWidth': 500, 'maxHeight': 500})
    } else {
      photo = place.icon;
    }

    if(place.opening_hours.open_now) {
      openNow = 'Open';
    } else {
      openNow = 'Closed';
    }

    var content = '<img src="'+photo+'">' + '<h2>' + place.name + '</h2>'+ '<p>' + place.formatted_address + '</p>' + '<p class="opening-hours">' + openNow + '</p>' + '<p>' + 'Rating: ' + place.rating + '</p>';
    // console.log(photo);
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(content);
      infowindow.open(map, this);
    });

    if(place.photos !== undefined){
      coffeeShops.push(place);
    }
    // console.log('++line 58', coffeeShops);
  }


  /** OUR CODE **/

  function getUserCurrentLocation (map) {
     var infoWindow = new google.maps.InfoWindow({map: map});
     var userCurrentLocation;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          // userCurrentLocation = pos;
          // console.log(pos);
          infoWindow.setPosition(pos);
          infoWindow.setContent('Current location.');
          map.setCenter(pos);

        }, function() {
          handleLocationError(true, infoWindow, map.getCenter());

        });
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
      }

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
      }

      // console.log(userCurrentLocation);
  }


  // function returnLocation () {
  //   if (navigator.geolocation) {
  //       navigator.geolocation.getCurrentPosition(function(position) {
  //         var pos = {
  //           lat: position.coords.latitude,
  //           lng: position.coords.longitude
  //         };
  //         return pos;
  //       });
  //   }
  // };

  // function centerMapOnWindowResize () {
  //   var center;
  //   function calculateCenter() {
  //     center = map.getCenter();
  //   }
  //   google.maps.event.addDomListener(map, 'idle', function() {
  //     calculateCenter();
  //   });
  //   google.maps.event.addDomListener(window, 'resize', function() {
  //     map.setCenter(center);
  //   });
  //
  // }


  return {
    getUserCurrentLocation: getUserCurrentLocation,
    initMap: initMap,
    coffeeShops: coffeeShops
  };
    // centerMapOnWindowResize: centerMapOnWindowResize,
    // returnLocation: returnLocation

});



//API KEY - AIzaSyDh0EN_AKBdNK769j_y92Fwo_tLL-eaH9c
