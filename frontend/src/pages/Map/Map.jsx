import { useEffect, useState, useRef } from "react";
import { useLoaderData } from "react-router-dom";
import "./Map.scss";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import plugGreen from "../../assets/plug-icon-green.png";
import Navbar from "../../components/Navbar/Navbar";
import useStore from "../../store/AuthProvider";
import SearchBar from "../../components/SearchBar/SearchBar";
import StationMarker from "../../components/StationMarker/StationMarker";

function Map() {
  const {
    setOpenBooking,
    setSelectedStation,
    open,
    setOpen,
    auth,
    setCarAvailableList,
    carAvailableList,
  } = useStore();
  const chargepoint = useLoaderData();

  const groupedData = [];

  Object.values(chargepoint).forEach((e) => {
    const index = groupedData.findIndex(
      (item) => item.charge_point_id_fr === e.charge_point_id_fr
    );
    if (index === -1) {
      groupedData.push({ ...e });
    } else if (!groupedData[index].plug_type.includes(e.plug_type)) {
      groupedData[index].plug_type += `,${e.plug_type}`;
    }
  });

  const stations = [];

  groupedData.forEach((e) => {
    const index = stations.findIndex(
      (item) => item.station_id === e.station_id
    );
    if (index === -1) {
      stations.push({ ...e });
    }
  });

  const markers = stations.map((e) => ({
    coord: [parseFloat(e.y_latitude), parseFloat(e.x_longitude)],
    stationName: `${e.station_name}`,
    stationAdress: `${e.adress}`,
    id: `${e.station_id}`,
    stationPlugType: `${e.plug_type}`,
  }));

  const customIcon = new Icon({
    iconUrl: plugGreen,
    iconSize: [38, 38],
  });

  const map = useRef(null);
  const [coords, setCoords] = useState({
    lat: 50.633333,
    long: 3.066667,
  });

  useEffect(() => {
    if (coords && map.current) {
      map.current.setView([coords.lat, coords.long], 13);
    }
  }, [coords, map]);

  const handlePick = (_, pos) => {
    setCoords({
      lat: pos.lat,
      long: pos.lng,
    });
  };

  const handleGeolocation = (_, pos) => {
    setCoords({
      lat: pos.coords.latitude,
      long: pos.coords.longitude,
    });
  };

  useEffect(() => {
    const getPosition = (position) => {
      setCoords({
        lat: position.coords.latitude,
        long: position.coords.longitude,
      });
    };
    navigator.geolocation.getCurrentPosition(getPosition);
  }, []);

  const hasValidPosition = coords.lat !== 0 && coords.long !== 0;

  useEffect(() => {
    const fetchCarAvailable = async () => {
      try {
        if (auth.user.status === "visitor" || !auth) {
          return;
        }
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/${auth.user.id}/car`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setCarAvailableList(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCarAvailable();
  }, [auth, carAvailableList]);

  return (
    <>
      <SearchBar
        handlePick={handlePick}
        handleGeolocation={handleGeolocation}
      />
      {hasValidPosition && (
        <MapContainer ref={map} center={[coords.lat, coords.long]} zoom={13}>
          <TileLayer
            attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
          />
          <StationMarker
            markers={markers}
            setOpen={setOpen}
            setSelectedStation={setSelectedStation}
            setOpenBooking={setOpenBooking}
            customIcon={customIcon}
          />
          {coords && (
            <Marker position={[coords.lat, coords.long]}>
              <Popup>
                <strong>Vous êtes ici</strong>
              </Popup>
            </Marker>
          )}
          <Navbar
            stations={stations}
            position={[coords.lat, coords.long]}
            open={open}
            setOpen={setOpen}
          />
        </MapContainer>
      )}
    </>
  );
}

export default Map;
