import PropTypes from "prop-types";
import NavbarStations from "../../assets/navbar_stations.svg";
import "./StationMiniCard.scss";
import type2 from "../../assets/plug-type/ev-plug-type2.svg";
import comboCCS from "../../assets/plug-type/ComboCCSplug.svg";
import chademo from "../../assets/plug-type/ev-plug-chademo.svg";
import useStore from "../../store/AuthProvider";

function StationMiniCard({ stations }) {
  const plugImages = {
    type2,
    comboCCS,
    chademo,
  };

  const { setOpenBooking, setSelectedStation } = useStore();

  return (
    <li className="station_mc">
      <img
        className="station_mc_logo"
        src={NavbarStations}
        draggable="false"
        alt="logo prise de recharge"
      />
      <h2>{stations.station_name}</h2>
      <p className="station_mc_distance">à {stations.distance} km</p>
      <p className="station_mc_plugtype">{stations.plug_type}</p>
      <img
        className="plug-type_logo"
        src={plugImages[stations.plug_type]}
        draggable="false"
        alt="logo type de prise"
      />
      <button
        type="button"
        className="chooseStation"
        onClick={() => {
          setSelectedStation(stations.station_id);
          setOpenBooking({
            page1: false,
            page2: true,
            page3: false,
            page4: false,
          });
        }}
      >
        {stations.station_name}
      </button>
    </li>
  );
}

StationMiniCard.propTypes = {
  stations: PropTypes.shape({
    station_id: PropTypes.string.isRequired,
    station_name: PropTypes.string.isRequired,
    distance: PropTypes.number.isRequired,
    plug_type: PropTypes.string.isRequired,
  }).isRequired,
};

export default StationMiniCard;
