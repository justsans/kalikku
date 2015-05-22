angular.module('com.htmlxprs.imageShare.directives').directive('chatList',['$rootScope','SOCKET_URL',function($rootScope,SOCKET_URL){
    return{
        replace:true,
        restrict:'AE',
        scope:{

        },
        link:function(scope,elem,attrs){

            var socket=io(SOCKET_URL);

            scope.messages=[];

            socket.on('event:incoming:image',function(data){

                scope.$apply(function(){
                    scope.messages.unshift(data);
                });

            });

            $rootScope.$on('event:file:selected',function(event,data){

                socket.emit('event:new:image',data);

                scope.$apply(function(){
                    scope.messages.unshift(data);
                });

            });
        },
        templateUrl:'views/chat-list.html'
    }
}]);