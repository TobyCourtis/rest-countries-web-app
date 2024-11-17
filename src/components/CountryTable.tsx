import {ColDef} from "ag-grid-community";
import {Country, CountryRow} from "../types/Country";
import React, {useEffect, useState} from "react";
import FlagRenderer from "../utils/FlagRenderer";
import {fetchCountries} from "../api/api";
import {AgGridReact} from "ag-grid-react";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import "ag-grid-community/styles/ag-theme-quartz.css";
import './CountryTable.css';


const CountryTable: React.FC = () => {
    const [rowData, setRowData] = useState<CountryRow[]>([]);

    function mapCountryToRowData(countries: Country[]) {
        let countryRows = countries.map((c): CountryRow => ({
            name: c.name.common,
            flag: c.flags.png,
            population: c.population,
            languages: Object.values(c.languages || {}).join(', '),
            currency: Object.values(c.currencies || {})
                .map((cur) => cur.name)
                .join(', '),
        }));
        console.log(countryRows.length)
        return countryRows;
    }

    useEffect(() => {
        fetchCountries()
            .then((countries) =>
                setRowData(
                    mapCountryToRowData(countries)
                )
            )
            .catch((error) => console.error('Error fetching countries:', error));
    }, [setRowData]);

    const columns: ColDef<CountryRow>[] = [
        {
            headerName: 'Flag',
            field: 'flag',
            cellRenderer: FlagRenderer
        },
        {headerName: 'Name', field: 'name', sortable: true, filter: true},
        {headerName: 'Population', field: 'population', sortable: true},
        {headerName: 'Languages', field: 'languages'},
        {headerName: 'Currency', field: 'currency'},
    ];

    return (
        <div className={"ag-theme-quartz-dark"} style={{height: '100%', width: '100%'}}>
            <AgGridReact
                rowData={rowData}
                columnDefs={columns}
                onRowClicked={(event) => {
                    if (event?.data) {
                        console.log(`Country selected ${event?.data.name}`)
                    }
                }}
                pagination={true}
                paginationPageSize={20}
            />
        </div>
    )
}


export default CountryTable
