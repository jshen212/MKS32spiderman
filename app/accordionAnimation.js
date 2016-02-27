angular.module('accordion', ['ngAnimate'])
.controller('AccordionDemoCtrl', function($scope) {

  $scope.groups = [
    {
      title: "Dynamic Group Header - 1",
      content: "Dynamic Group Body - 1",
      open: false,
      checked:true
    },
    {
      title: "Dynamic Group Header - 2",
      content: "Dynamic Group Body - 2",
      open: false,
      checked:false
    }
  ];
  $scope.onClick = function(item){
    item.open = !item.open;
  };
});
