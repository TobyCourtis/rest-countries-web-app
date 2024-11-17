import {ColDef, IRowNode} from "ag-grid-community";
import {Country, CountryRow} from "../types/Country";
import React, {useCallback, useEffect, useRef, useState} from "react";
import FlagRenderer from "../utils/FlagRenderer";
import {fetchCountries} from "../api/api";
import {AgGridReact, CustomCellRendererProps} from "ag-grid-react";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import "ag-grid-community/styles/ag-theme-quartz.css";
import './CountryTable.css';


const CountryTable: React.FC = () => {
    const [rowData, setRowData] = useState<CountryRow[]>([]);
    const [favourites, setFavourites] = useState<Set<string>>(new Set());
    const gridRef = useRef<AgGridReact<CountryRow>>(null);
    const [externalFilter, setExternalFilter] = useState<string>("none")


    function mapCountryToRowData(countries: Country[]) {
        let countryRows = countries.map((c): CountryRow => ({
            name: c.name.common,
            flag: c.flags.png,
            population: c.population,
            languages: Object.values(c.languages || {}).join(', '),
            currency: Object.values(c.currencies || {})
                .map((cur) => cur.name)
                .join(', '),
            isFavourite: favourites.has(c.name.common)
        }));
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

    const handleFavouriteChange = (countryName: string) => {
        setFavourites(prev => {
            const updatedFavourites = new Set(prev);
            if (updatedFavourites.has(countryName)) {
                updatedFavourites.delete(countryName);
            } else {
                updatedFavourites.add(countryName);
            }
            return updatedFavourites;
        });

        setRowData(prevRowData =>
            prevRowData.map(row => {
                if (row.name === countryName) {
                    return {...row, isFavourite: !row.isFavourite};
                }
                return row;
            })
        );
    };


    const columns: ColDef<CountryRow>[] = [
        {
            headerName: 'Flag',
            field: 'flag',
            cellRenderer: FlagRenderer,
            width: 100
        },
        {headerName: 'Name', field: 'name', sortable: true, filter: true},
        {headerName: 'Population', field: 'population', sortable: true},
        {headerName: 'Languages', field: 'languages'},
        {headerName: 'Currency', field: 'currency'},
        {
            headerName: 'Favourite',
            field: 'isFavourite',
            cellRenderer: (params: CustomCellRendererProps) => (
                <input
                    type="checkbox"
                    checked={favourites.has(params.data.name)}
                    onChange={() => handleFavouriteChange(params.data.name)}
                />
            ),
            width: 100,
            sortable: false
        }
    ];

    const doesExternalFilterPass = useCallback(
        (node: IRowNode<CountryRow>): boolean => {
            if (node.data) {
                switch (externalFilter) {
                    case "favourite":
                        return node.data.isFavourite;
                    default:
                        return true;
                }
            }
            return true;
        },
        [externalFilter],
    );

    const externalFilterChanged = useCallback((newValue: string) => {
        setExternalFilter(newValue);
        gridRef.current!.api.onFilterChanged();
    }, [setExternalFilter]);

    const isExternalFilterPresent = useCallback((): boolean => {
        return externalFilter !== "none";
    }, [externalFilter]);

    return (
        <div className={'ag-theme-quartz-dark outer-country-table'}>
            <div className={'buttons-div'}>
                <button onClick={() => externalFilterChanged("favourite")}>
                    Show Favourites
                </button>
                <button onClick={() => externalFilterChanged("none")}>
                    Hide Favourites
                </button>
            </div>
            <div className={"country-grid"}>
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={columns}
                    onRowClicked={(event) => {
                        if (event?.data) {
                            console.log(`Country selected ${event?.data.name}`)
                            console.log(event.data)
                        }
                    }}
                    pagination={true}
                    paginationPageSize={20}
                    isExternalFilterPresent={isExternalFilterPresent}
                    doesExternalFilterPass={doesExternalFilterPass}
                />
            </div>
        </div>
    )
}


export default CountryTable
