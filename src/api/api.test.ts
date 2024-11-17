import axios from 'axios';
import { fetchCountries } from './api';
import { Country } from '../types/Country';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('fetchCountries', () => {
    it('should return list of countries successfully', async () => {
        const mockCountries: Country[] = [
            {
                name: { common: "Switzerland" },
                flags: { png: "https://flagcdn.com/w320/ch.png" },
                population: 8654622,
                languages: {
                    fra: "French",
                    gsw: "Swiss German",
                    ita: "Italian",
                    roh: "Romansh"
                },
                currencies: {
                    CHF: { name: "Swiss Franc" }
                },
                region: "Europe"
            },
            {
                name: { common: "United Kingdom" },
                flags: { png: "https://flagcdn.com/w320/gb.png" },
                population: 67215293,
                languages: {
                    eng: "English"
                },
                currencies: {
                    GBP: {
                        name: "British pound"
                    }
                },
                region: "Europe"
            }
        ];
        mockedAxios.get.mockResolvedValueOnce({ data: mockCountries });

        const result = await fetchCountries();

        expect(result).toEqual(mockCountries);
        expect(mockedAxios.get).toHaveBeenCalledWith('https://restcountries.com/v3.1/all');
    });

    it('should return an empty array and log an error on failure', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

        const result = await fetchCountries();

        expect(result).toEqual([]);
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Error fetching countries:',
            'Network error'
        );

        consoleErrorSpy.mockRestore();
    });

    it('should return an empty array if data is not array', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        mockedAxios.get.mockResolvedValueOnce({ data: {} });

        const result = await fetchCountries();

        expect(result).toEqual([]);
        expect(consoleErrorSpy).toHaveBeenCalledWith('Invalid response format: Expected an array of countries.');

        consoleErrorSpy.mockRestore();
    });

    it('should log error if empty array is returned from api', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        mockedAxios.get.mockResolvedValueOnce({ data: [] });

        const result = await fetchCountries();

        expect(result).toEqual([]);
        expect(consoleErrorSpy).toHaveBeenCalledWith('No country ata was returned from restcountries.com.');

        consoleErrorSpy.mockRestore();
    });
});
