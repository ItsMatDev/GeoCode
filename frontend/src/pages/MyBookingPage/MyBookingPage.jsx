import { useEffect, useState } from "react";
import "./MyBookingPage.scss";
import BackgroundAsideType from "../../components/BackgroundAsideType/BackgroundAsideType";
import MyBooking from "../../components/MyBooking/MyBooking";
import useStore from "../../store/AuthProvider";

function MyBookingPage() {
  const { auth } = useStore();

  const [data, setData] = useState(null);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    const fetchBookByUser = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/${
            auth.user.id
          }/booking`,
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

        setData(stationData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchBookByUser();
  }, [!data, deleted]);

  if (data === null) {
    return (
      <BackgroundAsideType title="Mes réservations">
        <p className="mybookings_alternative">Chargement...</p>
      </BackgroundAsideType>
    );
  }

  if (data && data.length === 0) {
    return (
      <BackgroundAsideType title="Mes réservations">
        <p className="mybookings_alternative">
          Vous n'avez pas de réservation pour le moment.
        </p>
      </BackgroundAsideType>
    );
  }

  return (
    <BackgroundAsideType title="Mes réservations">
      {data.map((userBook) => (
        <MyBooking
          key={userBook.bookId}
          userBook={userBook}
          deleted={deleted}
          setDeleted={setDeleted}
        />
      ))}
    </BackgroundAsideType>
  );
}

export default MyBookingPage;
