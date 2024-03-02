import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { ToastContainer, toast } from "react-toastify";
import "./AddCarModal.scss";

function AddCarModal() {
  const [cars, setCars] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/car`,
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

        const carData = await response.json();
        setCars(carData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCars();
  }, []);

  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
    setSelectedModel("");
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const addCar = () => {
    const selectedCar = cars.filter((e) => e.model === selectedModel);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/car`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(selectedCar),
    });
    if (selectedCar.id) {
      toast.success("Enregistrement validé", {
        onClose: () => {
          setTimeout(() => {
            navigate("/connection");
          }, 2000);
        },
      });
    }
  };
  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button type="button" className="addCar">
            Ajouter une voiture
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="DialogOverlay" />
          <Dialog.Content className="DialogContent">
            <Dialog.Title className="DialogTitle">
              Ajouter une voiture
            </Dialog.Title>
            <Dialog.Description className="DialogDescription">
              Sélectionnez une marque et un modèle de voiture à ajouter:
            </Dialog.Description>
            <fieldset className="fieldsetBrand">
              <label className="labelBrand" htmlFor="brand">
                Marque
              </label>
              <select
                className="inputBrand"
                id="brand"
                value={selectedBrand}
                onChange={handleBrandChange}
              >
                <option value="">--Choisir une marque-</option>
                {cars &&
                  cars.map((car) => (
                    <option key={car.brand} value={car.brand}>
                      {car.brand}
                    </option>
                  ))}
              </select>
            </fieldset>
            {selectedBrand && (
              <fieldset className="fieldsetModel">
                <label className="labelModel" htmlFor="model">
                  Modèle
                </label>
                <select
                  className="inputModel"
                  id="model"
                  value={selectedModel}
                  onChange={handleModelChange}
                >
                  <option value="">--Choisir un modèle-</option>
                  {cars
                    .filter((car) => car.brand === selectedBrand)
                    .map((car) =>
                      car.model.length > 0 ? (
                        <option key={car.model} value={car.model}>
                          {car.model}
                        </option>
                      ) : (
                        <option key={car.model} value={car.model}>
                          Pas de modèle
                        </option>
                      )
                    )}
                </select>
              </fieldset>
            )}
            <footer className="carAddButtonContainer">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="buttonAddCar"
                  onClick={() => {
                    addCar();
                    window.location.reload();
                  }}
                >
                  Ajouter ma voiture
                </button>
              </Dialog.Close>
            </footer>
            <Dialog.Close asChild>
              <button type="button" className="closeButton" aria-label="Close">
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
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
    </>
  );
}

export default AddCarModal;
