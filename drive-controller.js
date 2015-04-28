'use strict';

angular.module('driveApp', [])
    .controller('driveController', function($scope,gapiAuthService,driveService) {

        //Auth

        $scope.checkingLogin=true;
        gapiAuthService.checkLogin().then(function(){
            $scope.loggedIn=true;
        },function(){
            $scope.loggedIn=false;
        }).finally(function(){
            $scope.checkingLogin=false;
        });

        $scope.login=function(){
            gapiAuthService.login().then(function(){
                $scope.loggedIn=true;
            },function(authResult){
                $scope.loggedIn = false;
                console.err(authResult);
            })
        };

        //Drive

        $scope.images=[];

        $scope.clickFileUpload=function(){
            document.getElementById('uploadImage').click();
        };

        $scope.upload=function(){
            $scope.uploading=true;
            var allFiles=document.getElementById('uploadImage').files;
            var file=allFiles[0];

            driveService.insertFile(file, file.name).then(function(link){
                $scope.images.push(link);
            }).finally(function(){
                $scope.uploading=false;
            });
        }

    });