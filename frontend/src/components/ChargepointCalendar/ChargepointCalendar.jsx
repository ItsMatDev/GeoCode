import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "./ChargepointCalendar.scss";
import useStore from "../../store/AuthProvider";
import arrowDark from "../../assets/arrowBackDark.svg";

function ChargepointCalendar() {
  const [dateAvailable, setDateAvailable] = useState([]);
  const {
    setOpenBooking,
    selectedStation,
    carAvailableList,
    setSelectedTime,
    selectedTime,
    selectedVehicle,
    setSelectedVehicle,
    setStationInfo,
    selectedDate,
    setSelectedDate,
  } = useStore();

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/book/${selectedStation}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ selectedDate }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setDateAvailable(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchTimeSlots();
  }, [selectedDate]);

  useEffect(() => {
    const fetchStationById = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/station/${selectedStation}`,
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

        const stationData = await response.json();

        setStationInfo(stationData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchStationById();
  }, [selectedStation]);

  const isFormValid = selectedDate && selectedTime && selectedVehicle;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      setOpenBooking({
        page1: false,
        page2: false,
        page3: true,
        page4: false,
      });
    }
  };

  return (
    <article className="allElements">
      <button
        className="backButtonModal"
        type="button"
        onClick={() => {
          setOpenBooking({
            page1: true,
            page2: false,
            page3: false,
            page4: false,
          });
        }}
      >
        <img src={arrowDark} alt="Retour en arrière" />
      </button>
      <h2 className="titleCard">Choisir un créneau</h2>

      <form onSubmit={handleSubmit}>
        <fieldset className="allElementsCalendar">
          <legend className="selectDate">Choisir une date :</legend>
          <Calendar
            className="calendar"
            onChange={handleDateChange}
            value={selectedDate}
            minDate={new Date()}
          />
          {selectedDate && (
            <>
              <time className="confirmDate">Votre date sélectionnée : </time>
              <time className="selectedDateDisplay">
                {selectedDate.toLocaleDateString()}
              </time>
            </>
          )}
        </fieldset>

        {dateAvailable[0] ? (
          <time className="timeVehicule">
            <label htmlFor="selectTime" className="selectTime">
              Choisir un créneau horaire :
            </label>
            <select
              className="slot"
              id="selectTime"
              onChange={(e) => setSelectedTime(new Date(e.target.value))}
            >
              <option value="">Sélectionnez un créneau</option>
              {dateAvailable
                .filter((time) => new Date(time) > new Date()) // Filtrer les créneaux horaires passés
                .map((time) => (
                  <option key={time} value={time}>
                    {new Date(time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </option>
                ))}
            </select>

            {carAvailableList?.[0] ? (
              <>
                <label htmlFor="selectVehicle" className="selectVehicle">
                  Choisir un véhicule :
                </label>

                <select
                  className="vehicle"
                  id="selectVehicle"
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                >
                  <option value="">Sélectionnez votre véhicule</option>
                  {carAvailableList.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {`${vehicle.brand} ${vehicle.model}`}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              "Pas de voiture disponible"
            )}
          </time>
        ) : (
          <p>Pas de créneau disponible</p>
        )}
        {isFormValid && (
          <button type="submit" className="submitButton">
            Valider la réservation
          </button>
        )}
      </form>
    </article>
  );
}

export default ChargepointCalendar;
