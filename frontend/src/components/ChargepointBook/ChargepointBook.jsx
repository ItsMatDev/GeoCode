import "./ChargepointBook.scss";
import comboCCS from "../../assets/plug-type/ComboCCSplug.svg";
import type2 from "../../assets/plug-type/ev-plug-type2.svg";
import chademo from "../../assets/plug-type/ev-plug-chademo.svg";
import useStore from "../../store/AuthProvider";
import arrowDark from "../../assets/arrowBackDark.svg";

function ChargepointBook() {
  const { setOpenBooking, stationInfo, selectedDate, selectedTime } =
    useStore();

  const station = stationInfo;

  const plugImages = {
    type2,
    comboCCS,
    Chademo: chademo,
  };

  return (
    <>
      <button
        className="backButtonModal"
        type="button"
        onClick={() => {
          setOpenBooking({
            page1: false,
            page2: true,
            page3: false,
            page4: false,
          });
        }}
      >
        <img src={arrowDark} alt="Retour en arrière" />
      </button>
      <h2 className="stationName">{station.station_name}</h2>
      <section className="stationInfos">
        <p className="date">
          Date :{" "}
          <time className="dateChoose">
            {selectedDate.toLocaleDateString()}
          </time>
        </p>
        <p className="time">
          Horaire :{" "}
          <time className="timeChoose">
            {selectedTime.toLocaleTimeString()}
          </time>
        </p>
        <p className="adressStation">
          Adresse :<span className="adressStationChoose">{station.adress}</span>
        </p>
        <p>Types de prises :</p>
        <ul className="plugList">
          <li>
            <p className="typePlugItem">- {station.name}</p>
            <img
              className="imgPlug"
              src={plugImages[station.name]}
              alt="logo d'une prise électrique de type 2"
            />
          </li>
        </ul>
        <p className="chargepointPower">
          Puissance de la borne :
          <span className="fullPower">{station.max_power}</span> kW
        </p>
        <p className="accessibility">
          Accessibilité :<span className="access">{station.accessibility}</span>
        </p>
      </section>
      <button
        type="button"
        className="book"
        onClick={() => {
          setOpenBooking({
            page1: false,
            page2: false,
            page3: false,
            page4: true,
          });
        }}
      >
        Réserver
      </button>
    </>
  );
}

export default ChargepointBook;
