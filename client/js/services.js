'use strict';

/* Services */


angular.module('ccfs14.services', [])
  .factory('fileService', function($http, $q) {

   return {

     getFile : function(url){
       var deferred = $q.defer();
       $http.get(url).success(function(data){
         deferred.resolve(data);
       }).error(function(){
         deferred.reject("An error occured while fetching file");
       });

       return deferred.promise;
     }
   }
  })
  .factory('ccfsSocket', function (socketFactory) {
    var ccfsIoSocket = io.connect('http://localhost:8000');

    var ccfsSocket = socketFactory({
      ioSocket: ccfsIoSocket
    });

    return ccfsSocket;
  })