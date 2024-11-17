import {render, screen, fireEvent, waitFor, cleanup} from '@testing-library/react';
import CountryTable from './CountryTable';
import {fetchCountries} from '../api/api';
import {act} from "react";

jest.mock('../api/api', () => ({
    fetchCountries: jest.fn(),
}));

describe('CountryTable', () => {
    beforeEach(() => {
        localStorage.clear();
        const mockCountries = [
            {
                name: {common: 'France'},
                flags: {png: 'flag.png'},
                population: 1234,
                languages: {fr: 'French'},
                currencies: {EUR: {name: 'Euro'}}
            },
            {
                name: {common: 'Japan'},
                flags: {png: 'flag.png'},
                population: 5678,
                languages: {ja: 'Japanese'},
                currencies: {JPY: {name: 'Yen'}}
            },
        ];
        (fetchCountries as jest.Mock).mockResolvedValue(mockCountries);
    });

    async function renderCountryTable() {
        await act(async () => {
            render(<CountryTable/>);
        });

        await waitFor(() => {
            expect(fetchCountries).toHaveBeenCalled();
        });
    }

    test('loads favourites from local storage', async () => {
        localStorage.setItem('favourites', JSON.stringify(['France', 'Germany']));

        await renderCountryTable();

        let franceFavouriteInput = screen.getByAltText('favourite-checkbox-France') as HTMLInputElement;
        let japanFavouriteInput = screen.getByAltText('favourite-checkbox-Japan') as HTMLInputElement;
        expect(franceFavouriteInput.checked).toBe(true);
        expect(japanFavouriteInput.checked).toBe(false);
    });

    test('updates local storage when favourites are selected', async () => {
        await renderCountryTable();

        const franceCheckbox = screen.getByAltText('favourite-checkbox-France');
        fireEvent.click(franceCheckbox);

        const storedFavourites = JSON.parse(localStorage.getItem('favourites') || '[]');
        expect(storedFavourites).toContain('France');
    });

    test('local storage persists between component mounts', async () => {
        await renderCountryTable();
        const franceCheckbox = screen.getByAltText('favourite-checkbox-France');
        fireEvent.click(franceCheckbox);
        const storedFavouritesAfterToggle = JSON.parse(localStorage.getItem('favourites') || '[]');
        expect(storedFavouritesAfterToggle).toContain('France');

        cleanup();
        await renderCountryTable();
        await waitFor(() => {
            const franceCheckboxAfterRemount = screen.getByAltText('favourite-checkbox-France') as HTMLInputElement;
            expect(franceCheckboxAfterRemount.checked).toBe(true);
        });
    });
});
