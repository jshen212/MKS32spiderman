angular.module('mapsApp', [])
.controller('MapCtrl', function ($scope, MapHelpers) {
  MapHelpers.initMap();
})
.factory('MapHelpers', function(){

  var map;
  var infowindow;

  function initMap(lat, lng) {
    lat = lat || 34.0219;
    lng = lng || -118.4814;
    var santaMonica = {lat: lat, lng: lng};


    map = new google.maps.Map(document.getElementById('map'), {
      center: santaMonica,
      zoom: 15
    });

    getUserCurrentLocation(map);

    infowindow = new google.maps.InfoWindow();

    var service = new google.maps.places.PlacesService(map);
    service.textSearch({
      location: santaMonica,
      radius: 8050,
      query: 'coffee'
    }, callback);
  }

  function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }
    }
  }

  function createMarker(place) {
    console.log(place);
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(place.name);
      infowindow.open(map, this);
    });
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

          userCurrentLocation = pos;

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


  return {
    getUserCurrentLocation: getUserCurrentLocation,
    initMap: initMap
  };

});
    //
    // $scope.markers = [];
    //
    // var infoWindow = new google.maps.InfoWindow();
    //
    // var createMarker = function (info){
    //
    //     var marker = new google.maps.Marker({
    //         map: $scope.map,
    //         position: new google.maps.LatLng(info.lat, info.long),
    //         title: info.city
    //     });
    //     marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';
    //
    //     google.maps.event.addListener(marker, 'click', function(){
    //         infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
    //         infoWindow.open($scope.map, marker);
    //     });
    //
    //     $scope.markers.push(marker);
    //
    // };
    //
    // for (i = 0; i < cities.length; i++){
    //     createMarker(cities[i]);
    // }
    //
    // $scope.openInfoWindow = function(e, selectedMarker){
    //     e.preventDefault();
    //     google.maps.event.trigger(selectedMarker, 'click');
    // };



//API KEY - AIzaSyDh0EN_AKBdNK769j_y92Fwo_tLL-eaH9c
