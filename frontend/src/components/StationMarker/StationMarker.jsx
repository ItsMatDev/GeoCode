import MarkerClusterGroup from "react-leaflet-cluster";
import PropTypes from "prop-types";
import { Marker, Popup } from "react-leaflet";

function StationMarker({
  markers,
  setOpen,
  setSelectedStation,
  setOpenBooking,
  customIcon,
}) {
  return (
    <MarkerClusterGroup>
      {markers.map((marker) => (
        <Marker key={marker.id} position={marker.coord} icon={customIcon}>
          <Popup>
            <article className="popUpContainer">
              <h2>{marker.stationName}</h2>
              <ul>
                <li className="popUpText">
                  <span>Adresse</span> : {marker.stationAdress}
                </li>
                <li className="popUpText">
                  <span>Prise</span> : {marker.stationPlugType}
                </li>
              </ul>
              <button
                type="button"
                className="markerButton"
                onClick={() => {
                  setOpen(true);
                  setSelectedStation(marker.id);
                  setOpenBooking({
                    page1: false,
                    page2: true,
                    page3: false,
                    page4: false,
                  });
                }}
              >
                Réserver
              </button>
            </article>
          </Popup>
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
}
StationMarker.propTypes = {
  markers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      coord: PropTypes.arrayOf(PropTypes.number).isRequired,
      stationName: PropTypes.string.isRequired,
      stationAdress: PropTypes.string.isRequired,
      stationPlugType: PropTypes.string.isRequired,
    })
  ).isRequired,
  setOpen: PropTypes.func.isRequired,
  setSelectedStation: PropTypes.func.isRequired,
  setOpenBooking: PropTypes.func.isRequired,
  customIcon: PropTypes.shape({
    options: PropTypes.shape({
      iconUrl: PropTypes.string.isRequired,
      iconSize: PropTypes.arrayOf(PropTypes.number).isRequired,
    }).isRequired,
    _initHooksCalled: PropTypes.bool.isRequired,
  }).isRequired,
};

export default StationMarker;
