import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
} from "react";
import PropTypes from "prop-types";
import userService from "../services/users";

const AuthContext = createContext();
const useStore = () => useContext(AuthContext);
const initialState = {
  user: { status: "visitor" },
};

function AuthProvider({ children }) {
  const [auth, setAuth] = useState(initialState);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedStation, setSelectedStation] = useState(null);
  const [carAvailableList, setCarAvailableList] = useState(null);
  const [open, setOpen] = useState(false);
  const [stationInfo, setStationInfo] = useState();
  const [openBooking, setOpenBooking] = useState({
    page1: false,
    page2: false,
    page3: false,
    page4: false,
  });
  const setConnection = async () => {
    try {
      const result = await userService.getCurrentUser();

      setAuth({ user: result });
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    setConnection();
  }, []);

  const memoizedValue = useMemo(
    () => ({
      auth,
      setAuth,
      openBooking,
      setOpenBooking,
      selectedStation,
      setSelectedStation,
      carAvailableList,
      setCarAvailableList,
      selectedTime,
      setSelectedTime,
      selectedVehicle,
      setSelectedVehicle,
      stationInfo,
      setStationInfo,
      selectedDate,
      setSelectedDate,
      open,
      setOpen,
    }),
    [
      auth,
      openBooking,
      setAuth,
      selectedStation,
      selectedTime,
      selectedVehicle,
      stationInfo,
      setStationInfo,
      selectedDate,
      setSelectedDate,
      open,
      setOpen,
    ]
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthProvider };
export default useStore;
