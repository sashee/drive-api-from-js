'use strict';

angular.module('driveApp')
    .factory('driveService', function ($q,gapiAuthService) {
        function createFolder(){
            return gapi.client.drive.files.insert(
                {
                    'resource':{
                        "title":'Drive API From JS Sample',
                        "mimeType": "application/vnd.google-apps.folder"
                    }
                }
            )
        }

        function ensureUploadFolderPresent(){
            return gapi.client.drive.files.list(
                {q:"mimeType = 'application/vnd.google-apps.folder' and trashed = false"}
            ).then(function(files){
                var directory=files.result.items;

                if(!directory.length){
                    return createFolder().then(function(res){
                        return res.result;
                    });
                }else{
                    return directory[0];
                }
            });
        }

        function insertFile(fileData, filename,parentId) {
            var deferred = $q.defer();

            var boundary = '-------314159265358979323846';
            var delimiter = "\r\n--" + boundary + "\r\n";
            var close_delim = "\r\n--" + boundary + "--";

            var reader = new FileReader();
            reader.readAsBinaryString(fileData);
            reader.onload = function (e) {
                var contentType = fileData.type || 'application/octet-stream';
                var metadata = {
                    'title': filename,
                    'mimeType': contentType,
                    "parents": [{"id":parentId}]
                };

                var base64Data = btoa(reader.result);
                var multipartRequestBody =
                    delimiter +
                    'Content-Type: application/json\r\n\r\n' +
                    JSON.stringify(metadata) +
                    delimiter +
                    'Content-Type: ' + contentType + '\r\n' +
                    'Content-Transfer-Encoding: base64\r\n' +
                    '\r\n' +
                    base64Data +
                    close_delim;

                var request = gapi.client.request({
                    'path': '/upload/drive/v2/files',
                    'method': 'POST',
                    'params': {'uploadType': 'multipart'},
                    'headers': {
                        'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
                    },
                    'body': multipartRequestBody});
                request.then(function(file){
                    deferred.resolve(file.result);
                },function(reason){
                    deferred.reject(reason);
                });
            };

            return deferred.promise;
        }

        function waitForFileToBecomeActive(fileId){
            var deferred = $q.defer();

            gapi.client.request({
                'path': '/drive/v2/files/'+fileId,
                'method': 'GET'
            }).then(function(){
                deferred.resolve();
            },function(){
                setTimeout(function(){
                    waitForFileToBecomeActive(fileId).then(function(){
                        deferred.resolve();
                    },function(reason){
                        deferred.reject(reason);
                    })
                },1000);
            });

            return deferred.promise;
        }

        function insertPermission(file){
            return gapi.client.drive.permissions.insert({
                'fileId': file.id,
                'resource': {
                    "withLink": true,
                    "role": "reader",
                    "type": "anyone"
                }
            })
        }

        return {
            insertFile: function (fileData, filename) {
                return gapiAuthService.login()
                    .then(function(){
                        return ensureUploadFolderPresent();
                    }).then(function(directory){
                        return insertFile(fileData,filename,directory.id);
                    }).then(function(file){
                        return waitForFileToBecomeActive(file.id).then(function(){
                            return insertPermission(file).then(function(){
                                return file.webContentLink;
                            });
                        });
                    });
            }
        }
    });