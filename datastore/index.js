const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId ((err, id) => {
    fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
      if (err) {
        throw ('error creating record');
      } else {
        callback(null, { id, text });
      }
    });
  });
  // items[id] = text;
  // {1: 'whatever', 2: 'whateverklsdjf', 3: 'lkjdsf'}
  // [{id: 1, text: 'sdlkfj'},{},{}]
  //create text file that is labeled with with id and we are going to write in text as its content
  //if there is an error we throw creating error
  //use same callback as what was here previously
  // fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
  //   if (err) {
  //     throw ('error creating record');
  //   } else {
  //     callback(null, { id, text });
  //   }
  // });
  // callback(null, { id, text });
};

exports.readAll = (callback) => {
  //use readdir (path, callback)
  //in the call back we have to return the files array

  // declares an array of objects and uses _.map to ensure that each element of the array is an object with two properties: (1) id; and (2) text;
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('Read files error');
    } else {
      //for length of files
      let data = _.map(files, (fileName) => {
        return {id: fileName.slice(0, 5), text: fileName.slice(0, 5)};
      });
      callback(null, data);
    }
  });

  // ['00001.txt','00002.txt']
  // [{id: 00001, text: 00001}, {id: 00001, text: 00002}]

  // {1: 'whatever', 2: 'whateverklsdjf', 3: 'lkjdsf'}
  // [{id: 1, text: 'sdlkfj'},{},{}]
  // ['1.txt','2.txt']
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // console.log(data);
  // callback(null, data);
};

exports.readOne = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      text = text.toString();
      callback(null, { id, text});
    }
  });

  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
};

exports.update = (id, text, callback) => {
  //use readone to see if there is a value at id
  //if there is then we pas in the write file as the call back into readOne;
  exports.readAll((error, data) =>{
    if (!data.map( (e) => e.id).includes(id)) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
        if (err) {
          callback(new Error(`No item with id: ${id}`));
        } else {
          callback(null, { id, text });
        }
      });
    }
  });


  // if (exports.readAll((error, data) => !data.includes(id) )) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
  //     if (err) {
  //       callback(new Error(`No item with id: ${id}`));
  //     } else {
  //       callback(null, { id, text });
  //     }
  //   });
  // }



  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
};

exports.delete = (id, callback) => {
  exports.readAll((error, data) =>{
    if (!data.map( (e) => e.id).includes(id)) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.rm(path.join(exports.dataDir, `${id}.txt`), (err) => {
        if (err) {
          callback(new Error(`No item with id: ${id}`));
        } else {
          callback();
        }
      });
    }
  });



  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
