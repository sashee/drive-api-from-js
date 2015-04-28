'use strict';

angular.module('driveApp')
    .factory('gapiAuthService', function ($q) {
        var client_id="971028619851-j8iphhel9n0n7saf1a2rpjcn15dmq2no.apps.googleusercontent.com";
        var scope=['https://www.googleapis.com/auth/drive.file'];

        function getConfig(immediate){
            return {
                'client_id': client_id,
                'scope': scope,
                immediate: immediate
            }
        }

        function isTokenNeedsRefresh(token){
            return !token || moment.duration(moment(token.expires_at*1000).valueOf()-moment().valueOf()).minutes()<10;
        }

        return {
            checkLogin:function(){
                var deferred = $q.defer();

                gapiCallbacks.push(function () {
                    if (isTokenNeedsRefresh(gapi.auth.getToken())) {
                        gapi.auth.authorize(getConfig(true), function (authResult) {
                            if (authResult && !authResult.error) {
                                deferred.resolve(gapi.auth.getToken().access_token);
                            } else {
                                deferred.reject(authResult);
                            }
                        })
                    } else {
                        deferred.resolve(gapi.auth.getToken().access_token);
                    }
                });

                return deferred.promise;
            },

            login:function() {
                var deferred = $q.defer();

                this.checkLogin().then(function (accessToken) {
                    deferred.resolve(accessToken);
                }, function () {
                    gapi.auth.authorize(getConfig(false), function (authResult) {
                        if (authResult && !authResult.error) {
                            deferred.resolve(gapi.auth.getToken().access_token);
                        } else {
                            deferred.reject(authResult);
                        }
                    })
                });

                return deferred.promise;
            }
        }


    });
