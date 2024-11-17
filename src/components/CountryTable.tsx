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
    const LOCAL_STORAGE_FAVOURITES_KEY: string = "favourites";

    const [rowData, setRowData] = useState<CountryRow[]>([]);
    const [favourites, setFavourites] = useState<Set<string>>(() => {
        const storedFavourites = localStorage.getItem(LOCAL_STORAGE_FAVOURITES_KEY);
        return storedFavourites ? new Set(JSON.parse(storedFavourites)) : new Set();
    })
    const gridRef = useRef<AgGridReact<CountryRow>>(null);
    const [externalFilter, setExternalFilter] = useState<string>("none")

    useEffect(() => {
        fetchCountries()
            .then((countries) =>
                setRowData(
                    mapCountryToRowData(countries)
                )
            )
            .catch((error) => console.error('Error fetching countries:', error));
    }, [setRowData]);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_FAVOURITES_KEY, JSON.stringify(Array.from(favourites)));
    }, [favourites]);

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
                    alt={`favourite-checkbox-${params.data.name}`}
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

    const onFilterTextBoxChanged = useCallback(() => {
        gridRef.current!.api.setGridOption(
            "quickFilterText",
            (document.getElementById("filter-text-box") as HTMLInputElement).value,
        );
    }, []);

    return (
        <div className={'ag-theme-quartz-dark outer-country-table'}>
            <div className={'filter-content-div'}>
                <label>
                    <input
                        type="radio"
                        name="filter"
                        onChange={() => externalFilterChanged("none")}
                        defaultChecked={true}
                    />
                    All
                </label>
                <label>
                    <input
                        type="radio"
                        name="filter"
                        onChange={() => externalFilterChanged("favourite")}
                    />
                    Favourites
                </label>
                <span>Search:</span>
                <input
                    type="text"
                    id="filter-text-box"
                    placeholder="Filter..."
                    onInput={onFilterTextBoxChanged}
                />
            </div>
            <div className={"country-grid"}>
                <AgGridReact
                    className={'ag-country-grid'}
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
