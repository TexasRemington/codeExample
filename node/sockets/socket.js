module.exports = function(server){
  var Canvas = require('../models/canvas');
  var io = require('socket.io')(server);
  var fs = require('fs');
  var path = require('path');
  var line_history = [];
  var room = {};
  var urls = [];

  io.on('connection', function(socket) {
    console.log('User connected. Socket id %s', socket.id);
    socket.on('joinRoom', function(room) {
      socket.join(room);
      console.log('Room name: ', room);

      var sendCanvas = function(room){
        Canvas.findOne({ url: room }).exec(function(err,canvas){
          if(err) {
            console.log('Error on finding url from Mongo: ', err);
          }if(canvas.url !== room){
            var newCanvas = new Canvas({
              url: room,
              line_history: new Array,
              dateCreated: Date.now()
            });

            return newCanvas.save(function(err, canvas){
              if(err){
                console.log(err)
              } else {
                console.log('newCanvas saved: ', canvas);
              }
            });
          }

          console.log('Found the canvas url', canvas.url);
          console.log(canvas.line_history)
          line_history.push(canvas.line_history);

          for (var i in line_history) {
            socket.emit('draw_line', { line: line_history[i] } );
            console.log('Server line history array: ', line_history[i])
          }
        });
      };
      sendCanvas(room);

      socket.on('draw_line', function (data) {
        // add received line to history
        console.log('Incoming data.line from client: ', data)
        line_history.push(data);
        // send line to all clients
        var updateCanvas = function(room, data){
          Canvas.findOneAndUpdate({url: room }, { $push: {line_history: data} }).exec(function(err,canvas){
            if(err){
              console.log(err);
            }
            console.log('updated the line array in db');
          });
        };
        updateCanvas(room, data);
        io.in(room).emit('draw_line', { line: data });
      });
    });
  });
};

socket.on("disconnect", function() {
  console.log('User disconnect. Socket id %s', socket.id);
});
