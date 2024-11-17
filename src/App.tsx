import React from 'react';
import CountryTable from "./components/CountryTable";
import './App.css';

function App() {
    return (
        <div className="App">
            <div className={'title'}>
                <h1 id={'title'}>Rest Countries Web App</h1>

            </div>
            <div className={'country-table'}>
                <CountryTable/>
            </div>
        </div>
    );
}

export default App;
