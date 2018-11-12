/*
*Library for storing and editing data
*
*
*
*/

//Dependencies
var path = require('path');
var fs = require('fs');


// Container the module (to be exported)
var lib = {};

//Base directory of the data folder
lib.baseDir = path.join(__dirname,'/../.data/');

// Write to the data file
lib.create = function(dir, file, data,callback){
  // Open the file for writing
  fs.open(lib.baseDir+dir+'/'+file+'.json','wx',function(err,fileDescriptior){
 if(!err && fileDescriptior){
  // Convert data to string
  var stringData = JSON.stringify(data);

  //Write to file and close it
  fs.watchFile(fileDescriptior,stringData,function(err){
     if(!err){
         fs.close(fileDescriptior, function(err){
             if(!err){
                 callback(false);
             } else {
                 callback('Error closing new file');
             }
         });
     } else {
         callback('Error writing tonew file');
     }
   });
 } else {
   callback('Could not create new file, it may already exist');
 }
  });
};