import React, { Component, useEffect } from "react";
// import { Map, GoogleApiWrapper, Marker, Polyline } from "google-maps-react";
import { fitBounds } from "google-map-react";

export function find_fitbound(coords, size) {
  if (coords.length === 0) {
    return [{lat: 28.6139, lng: 77.209}, 5];
  }
  var latList = [];
  var lngList = [];
  for (let i = 0; i < coords.length; i++) {
    latList.push(coords[i].latitude);
    lngList.push(coords[i].longitude);
  }
  var minLat = Math.min(...latList);
  var maxLat = Math.max(...latList);
  var minLng = Math.min(...lngList);
  var maxLng = Math.max(...lngList);
  console.log(latList, lngList);
  const bounds = {
    ne: {
      lat: minLat,
      lng: maxLng,
    },
    sw: {
      lat: maxLat,
      lng: minLng,
    },
  };
  const { center, zoom } = fitBounds(bounds, { height: 200, width: 360 });
  return [center, zoom];
}
