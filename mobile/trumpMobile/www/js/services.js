angular.module('starter.services', ['ngResource'])

.factory('Room', function ($resource) {
    return $resource('http://localhost:5000/rooms/:roomId', {'query': {method: 'GET', isArray: false }});
});