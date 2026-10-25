
import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER = [16.5062, 80.648];

function isValidCoordinate(value, min, max) {
  const number = Number(value);
  return value !== null &&
    value !== undefined &&
    value !== "" &&
    Number.isFinite(number) &&
    number >= min &&
    number <= max;
}

function getCoordinates(report) {
  const latitude = report.latitude ?? report.lat;
  const longitude = report.longitude ?? report.lng ?? report.lon;

  if (
    !isValidCoordinate(latitude, -90, 90) ||
    !isValidCoordinate(longitude, -180, 180)
  ) {
    return null;
  }

  return [Number(latitude), Number(longitude)];
}

function FitMarkers({ points }) {
  const map = useMap();

  useMemo(() => {
    if (points.length > 0) {
      map.fitBounds(points, { padding: [30, 30], maxZoom: 15 });
    }
  }, [map, points]);

  return null;
}

export default function CivicMap({
  reports = [],
  onOpen,
}) {
  console.log("Report coordinates:", reports.map(r => ({ title: r.title, latitude: r.latitude, longitude: r.longitude, lat: r.lat, lng: r.lng })));

  const markers = reports
    .map((report) => ({
      report,
      coordinates: getCoordinates(report),
    }))
    .filter((item) => item.coordinates !== null);

  const markerPositions = markers.map((item) => item.coordinates);
  console.log("Valid map markers:", markers.map(({ report, coordinates }) => ({ title: report.title, coordinates })));

  return (
    <section className="civic-map-section">
      <div className="civic-map-heading">
        <div>
          <p className="civic-map-eyebrow">COMMUNITY MAP</p>
          <h2>Civic issues near you</h2>
          <p>
            Explore reported issues near you.
          </p>
        </div>
        <span className="civic-map-count">
          {markers.length} mapped
        </span>
      </div>

      {markers.length === 0 && (
        <p className="civic-map-notice">
          No reports have valid coordinates yet. Existing reports are
          preserved; add coordinates to display their markers.
        </p>
      )}

      <div className="civic-map-frame">
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={12}
          scrollWheelZoom
          className="civic-map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />


          {markers.map(({ report, coordinates }) => (
            <Marker
              key={report.id}
              position={coordinates}
              icon={L.divIcon({
                className: "civic-map-marker",
                html: '<span class="civic-map-marker-dot"></span>',
                iconSize: [24, 24],
                iconAnchor: [12, 12],
              })}
            >
              <Popup>
                <div className="civic-map-popup">
                  <strong>{report.title || "Civic issue"}</strong>
                  <p>{report.category || "Uncategorized"}</p>
                  <p>Status: {report.status || "Reported"}</p>
                  {onOpen && (
                    <button
                      type="button"
                      onClick={() => onOpen(report)}
                    >
                      View report
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {markerPositions.length > 0 && (
            <FitMarkers points={markerPositions} />
          )}
        </MapContainer>
      </div>
    </section>
  );
}
