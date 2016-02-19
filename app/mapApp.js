angular.module('mapsApp', [])
.controller('MapCtrl', function ($scope, MapHelpers) {

    var mapOptions = {
        zoom: 15,
        center: new google.maps.LatLng(34.0219, -118.4814),
        mapTypeId: google.maps.MapTypeId.ROADSMAP
    };

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    MapHelpers.getUserCurrentLocation($scope.map);


})
.factory('MapHelpers', function(){
  function getUserCurrentLocation(map){
     var infoWindow = new google.maps.InfoWindow({map: map});

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent('Location found.');
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
  }

  return {
    getUserCurrentLocation: getUserCurrentLocation
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
