import PropTypes from "prop-types";
import { PlaceKit } from "@placekit/autocomplete-react";
import "@placekit/autocomplete-js/dist/placekit-autocomplete.css";

function SearchBar({ handlePick, handleGeolocation }) {
  return (
    <form role="search" className="searchBar">
      <label htmlFor="searchLabel" className="searchLabel">
        Adresse
      </label>
      <PlaceKit
        apiKey={import.meta.env.VITE_API_KEY}
        onPick={handlePick}
        onGeolocation={handleGeolocation}
        placeholder="Rechercher une adresse..."
        id="searchLabel"
      />
    </form>
  );
}

SearchBar.propTypes = {
  handlePick: PropTypes.func.isRequired,
  handleGeolocation: PropTypes.func.isRequired,
};

export default SearchBar;
