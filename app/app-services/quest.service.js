(function () {
    'use strict';

    angular
        .module('app')
        .factory('QuestService', Service2);

    function Service2($http, $q) {
        var service2 = {};

        service2.GetAll = GetAll;
        service2.GetByNum = GetByNum;

        return service2;

        function GetAll() {
            return $http.get('/api/quest/getall').then(handleSuccess, handleError);
        }


        function GetByNum(num) {
            return $http.get('/api/quest/getbynum'+num).then(handleSuccess, handleError);
        }

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();
