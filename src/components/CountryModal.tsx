import React from "react";
import {CountryModalProps} from '../types/Country'
import './CountryModal.css'

const CountryModal: React.FC<CountryModalProps> = ({country, onClose}) => (
    // todo, improve basic CSS
    <div className="country-modal-overlay">
        <div className="country-modal-content">
            <h2>Country Details</h2>
            <br/>
            <div className="country-modal-body">
                <h2>{country.name}</h2>
                <p>{country.flag}</p>
                <p>Population: {country.population}</p>
                <p>Languages: {country.languages}</p>
                <p>Currency: {country.currency}</p>
                <p>Region: {country.region}</p>
                <button className="close" onClick={onClose}>X</button>
            </div>
        </div>
    </div>
);

export default CountryModal;