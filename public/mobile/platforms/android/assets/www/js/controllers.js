angular.module('starter.controllers', ['starter.services', 'socket.services', 'constants'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  $scope.fbLogin = function() {
      openFB.login(
          function(response) {
            if (response.status === 'connected') {
              console.log('Facebook login succeeded');
              $scope.closeLogin();
            } else {
              alert('Facebook login failed');
            }
          },
          {scope: 'email,publish_actions'});
  };
})

.controller('RoomsCtrl', function($scope, Room) {
  Room.get(function(data) {
    $scope.rooms = data.rooms;
  });
})

.controller('RoomCtrl', function($scope, $stateParams, Room, socket, apiUrl) {
  $scope.room = Room.get({roomId: $stateParams.roomId});
      console.log('sending show to beginers');
  console.log('######apiUrl 1 is ' + apiUrl);
  socket.emit("/room/show", {'roomId': 'Beginers'});
  socket.on('updateTable', function (data){
    console.log('got message from server', data);
    $scope.view = data.view;
  });

  socket.on('updateMessage', function (data) {
    if(!$scope.messages) {
      $scope.messages = [];
    }
    $scope.messages.unshift(data);
  });

});




