import PropTypes from "prop-types";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import "./DeleteCarConfirmationModal.scss";

function DeleteCarConfirmationModal({ carData, counterCar }) {
  const deleteCar = () => {
    const carId = carData[counterCar];
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/car/${carId.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    return null;
  };
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        {carData && (
          <button type="button" className="addCar">
            Supprimer la voiture
          </button>
        )}
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="AlertDialogOverlay" />
        <AlertDialog.Content className="AlertDialogContent">
          <AlertDialog.Title className="AlertDialogTitle">
            Êtes-vous vraiment sûr de vouloir supprimer cette voiture ?
          </AlertDialog.Title>
          <AlertDialog.Description className="AlertDialogDescription">
            Cette action va supprimer définitivement votre voiture et toutes les
            réservations liées.
          </AlertDialog.Description>
          <footer className="chooseButton">
            <AlertDialog.Cancel asChild>
              <button type="button" className="carButtonDelete">
                Annuler
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                type="button"
                className="carButtonDelete"
                onClick={() => {
                  deleteCar();
                  window.location.reload();
                }}
              >
                Oui
              </button>
            </AlertDialog.Action>
          </footer>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
DeleteCarConfirmationModal.propTypes = {
  carData: PropTypes.shape({
    max_power: PropTypes.number.isRequired,
    plug_type: PropTypes.string.isRequired,
  }).isRequired,
  counterCar: PropTypes.number.isRequired,
};

export default DeleteCarConfirmationModal;
