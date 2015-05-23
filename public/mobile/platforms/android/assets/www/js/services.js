angular.module('starter.services', ['ngResource', 'constants'])

.factory('Room', function ($resource, apiUrl) {
    console.log('apiUrl is' + apiUrl );
    return $resource(apiUrl + '/rooms/:roomId', {'query': {method: 'GET', isArray: false }});
});