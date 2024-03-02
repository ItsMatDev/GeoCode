import React from "react";
import "./Navbar.scss";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import * as Dialog from "@radix-ui/react-dialog";
import * as geolib from "geolib";
import StationMiniCard from "../StationMiniCard/StationMiniCard";
import NavbarMap from "../../assets/navbar_map.svg";
import NavbarStations from "../../assets/navbar_stations.svg";
import NavbarUserPage from "../../assets/navbar_user_page.svg";
import useStore from "../../store/AuthProvider";
import ChargepointBook from "../ChargepointBook/ChargepointBook";
import ChargepointBook2 from "../ChargepointBook2/ChargepointBook2";
import ChargepointCalendar from "../ChargepointCalendar/ChargepointCalendar";

function Navbar({ stations, position, open, setOpen }) {
  const referencePoint = { latitude: position[0], longitude: position[1] };

  const stationsWithDistance = stations.map((station) => {
    const latitude = station.y_latitude;
    const longitude = station.x_longitude;

    const distanceInMeters = geolib.getDistance(referencePoint, {
      latitude,
      longitude,
    });

    const distanceInKilometers =
      Math.round((distanceInMeters / 1000) * 100) / 100;

    return {
      ...station,
      distance: distanceInKilometers,
    };
  });

  stationsWithDistance.sort((a, b) => a.distance - b.distance);

  const nearestStations = stationsWithDistance.slice(0, 10);
  const { openBooking, setOpenBooking } = useStore();

  return (
    <nav className="navbar_container">
      <ul className="navbar_list">
        <li className="navbar_element">
          <Link to="/map" draggable="false">
            <img
              className="navbar_img"
              src={NavbarMap}
              draggable="false"
              alt="logo de carte"
            />
          </Link>
        </li>
        <li className="navbar_element navbar_element_middle">
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger
              onClick={() => {
                setOpenBooking({
                  page1: true,
                  page2: false,
                  page3: false,
                  page4: false,
                });
              }}
            >
              <img
                className="navbar_img"
                src={NavbarStations}
                draggable="false"
                alt="logo de station"
              />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="dialogOverlay" />
              <Dialog.Content className="dialogContent">
                {openBooking.page1 && (
                  <ul>
                    {nearestStations.map((station) => (
                      <StationMiniCard
                        key={station.charge_point_id_fr}
                        stations={station}
                      />
                    ))}
                  </ul>
                )}
                {openBooking.page2 && <ChargepointCalendar />}
                {openBooking.page3 && <ChargepointBook />}
                {openBooking.page4 && <ChargepointBook2 />}
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </li>
        <li className="navbar_element">
          <Link to="/profile" draggable="false">
            <img
              className="navbar_img"
              src={NavbarUserPage}
              draggable="false"
              alt="logo de profil"
            />
          </Link>
        </li>
      </ul>
    </nav>
  );
}

Navbar.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  stations: PropTypes.arrayOf(
    PropTypes.shape({
      charge_point_id_fr: PropTypes.string.isRequired,
      y_latitude: PropTypes.string.isRequired,
      x_longitude: PropTypes.string.isRequired,
    })
  ).isRequired,
  position: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
};

export default Navbar;
