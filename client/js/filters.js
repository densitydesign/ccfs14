'use strict';

/* Filters */

angular.module('ccfs14.filters', [])
	.filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }])
  .filter('monthsIT', function() {
  	var months = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"]
    return function(_) {
      return months[_]
    }
  })
  .filter('districtCell', function() {
    return function(area, data) {
          var geojson = {"type": "FeatureCollection","features": []}
          var areas = {
            "brera" : [5858, 5859, 5860, 5861, 5758, 5759, 5760, 5761, 5658, 5659, 5660, 5661, 5558, 5559, 5560, 5561, 5458, 5459, 5460, 5461, 5358, 5359, 5360, 5361, 5258, 5259, 5260, 5261],
            "tortona" : [4749, 4750, 4751, 4752, 4753, 4649, 4650, 4651, 4652, 4653, 4549, 4550, 4551, 4552, 4553, 4449, 4450, 4451, 4452, 4453],
            "lambrate" : [6176, 6177, 6178, 6179, 6180, 6076, 6077, 6078, 6079, 6080, 5976, 5977, 5978, 5979, 5980, 5876, 5877, 5878, 5879, 5880],
            "porta_romana" : [4661, 4662, 4663, 4664, 4665, 4666, 4667, 4668, 4561, 4562, 4563, 4564, 4565, 4566, 4567, 4568, 4461, 4462, 4463, 4464, 4465, 4466, 4467, 4468, 4361, 4362, 4363, 4364, 4365, 4366, 4367, 4368]
          }
          var cells = areas[area]
          geojson["time"] = data.time;
          data.features.forEach(function(d){
            if(cells.indexOf(d.properties.id) > -1)
              return geojson.features.push(d)
          })
      return geojson
    }
  })
  .filter('districtMask', function() {
    return function(area, data) {
        var geojson = {"type": "FeatureCollection","features": []}
        data.features.forEach(function(d){
            if(d.properties.id == area)
              geojson.features.push(d)
          })
      return geojson
    }
  })
  .filter('biketimeline', function() {
    return function(data) {
        var timeline = [
          {"key": "available bikes", values : []},
          {"key": "in use bikes", values : []}
        ]
        
        data.steps.sort(function(a, b) { return d3.descending(a.start, b.start); })
        data.steps.forEach(function(d){

          timeline[0].values.push({date:d.start, value: d.availableBikes})
          timeline[1].values.push({date:d.start, value: d.inUseBikes})

        })

      return timeline
    }
  })
  .filter('callsocialtimeline', function() {
    return function(data) {
      var timelines = [
        [{"key": "amount of calls", values : []}],
        [{"key": "amount of tweets", values : []}]
      ]

        data.steps.sort(function(a, b) { return d3.descending(a.start, b.start); })
        data.steps.forEach(function(d){
          timelines[0][0].values.push({date:d.start, value: d.mobily_activity})
          timelines[1][0].values.push({date:d.start, value: d.social_activity})

        })

      return timelines
    }
  })
  .filter('getPath', function() {
    return function(key, location) {
      var path;

      var keyMap ={
        "66" : "brera",
        "84" : "tortona",
        "76" : "lambrate",
        "80" : "porta_romana",
        "78" : "/usernet",
        "77" : "/geocity"
      }

      if(key == 77 || key == 78){
        path = keyMap[String(key)]
      }else{
        if(location == "/geocity"){
          path = "/geodistrict/" + keyMap[String(key)]
        }
        else if(location == "/usernet"){
          path = "/netdistrict/" + keyMap[String(key)]
        }
        else{
          path = location.split("/")[1] + "/" + keyMap[String(key)]
        }
      }

      return path
    }
  })
  .filter('districtVenues', function() {
    return function(data) {
        var geojson = {"type": "FeatureCollection","features": []}
        data.venues.forEach(function(d){
              
              var feature = { "type": "Feature", 
                "properties": {"id":d.id,"name":d.name,"address":d.address},
                "geometry": { "type": "Point", "coordinates": [d.longitude, d.latitude]}
              }
              geojson.features.push(feature)
          })
      return geojson
    }
  })
  .filter('mapDistrictUrl', function() {
    return function(district) {
        var mapDistrict = {
          "brera": "Brera",
          "tortona": "Tortona",
          "lambrate": "Lambrate",
          "porta_romana": "PRomana"
        }
        
        return mapDistrict[district]
    }
  })

