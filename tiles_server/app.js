var express = require("express"),
    app = express(),
    MBTiles = require('mbtiles');


var port = 3000;

var mbtilesLocation = __dirname + '/data/fuorisalone2014.mbtiles';

new MBTiles(mbtilesLocation, function(err, mbtiles) {
  if (err) throw err;
  app.get('/:z/:x/:y.*', function(req, res) {
    var extension = req.param(0);
    switch (extension) {
      case "png": {
        mbtiles.getTile(req.param('z'), req.param('x'), req.param('y'), function(err, tile, headers) {
          if (err) {
            res.status(404).send('Tile rendering error: ' + err + '\n');
          } else {
            res.header("Content-Type", "image/png")
            res.send(tile);
          }
        });
        break;
      }
      case "grid.json": {
        mbtiles.getGrid(req.param('z'), req.param('x'), req.param('y'), function(err, grid, headers) {
          if (err) {
            res.status(404).send('Grid rendering error: ' + err + '\n');
          } else {
            res.header("Content-Type", "text/json")
            res.send(grid);
          }
        });
        break;
      }
    }
  });

});

// actually create the server
app.listen(port);