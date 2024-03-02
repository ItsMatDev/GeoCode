import "./ChargepointBook2.scss";
import { format } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useStore from "../../store/AuthProvider";
import "react-toastify/dist/ReactToastify.css";
import arrowDark from "../../assets/arrowBackDark.svg";

function ChargepointBook2() {
  const {
    selectedTime,
    selectedVehicle,
    setSelectedVehicle,
    selectedStation,
    setOpenBooking,
    setOpen,
  } = useStore();
  const navigate = useNavigate();

  const formattedDate = format(selectedTime, "yyyy-MM-dd HH:mm:ss", {
    timeZone: "Europe/Paris",
  });
  const postBooking = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/booking`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            formattedDate,
            selectedVehicle,
            selectedStation,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      if (response.ok) {
        setSelectedVehicle(null);
        toast.success("Votre réservation est validée !", {
          onClose: () => {
            setTimeout(() => {
              setOpen(false);
              setOpenBooking({
                page1: true,
                page2: false,
                page3: false,
                page4: false,
              });
            }, 3000);
          },
        });
      } else {
        toast.error("La réservation a échoué, et n'est pas prise en compte !", {
          onClose: () => {
            setTimeout(() => {
              navigate("/map");
            }, 3000);
          },
        });
      }
    } catch (error) {
      console.error(error);
    }
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
      <main className="ChargepointBook2TextContainer">
        <p className="ChargepointBook2Text">
          Un tarif de 2 euros vous sera facturé pour la réservation.
        </p>
        <p className="beCareful">
          Les frais de réservation ne seront pas remboursés en cas d'annulation.
        </p>
        <p className="ChargepointBook2Text">
          Êtes vous sûr de vouloir réserver ?
        </p>
        <footer>
          <button
            className="answerBtn"
            type="button"
            onClick={() => {
              postBooking();
            }}
          >
            Oui
          </button>
          <button
            className="answerBtn"
            type="button"
            onClick={() =>
              toast.error(
                "La réservation a été abandonnée, et non prise en compte !",
                {
                  onClose: () => {
                    setTimeout(() => {
                      navigate("/map");
                    }, 3000);
                  },
                }
              )
            }
          >
            Non
          </button>
          <ToastContainer
            position="top-right"
            autoClose={2500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable={false}
            pauseOnHover
            theme="colored"
          />
        </footer>
      </main>
    </>
  );
}

export default ChargepointBook2;
