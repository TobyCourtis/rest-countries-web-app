import axios from 'axios';
import { Country } from '../types/Country';

export const fetchCountries = async (): Promise<Country[]> => {
    try {
        const { data } = await axios.get<Country[]>('https://restcountries.com/v3.1/all');

        if (!Array.isArray(data)) {
            console.error('Invalid response format: Expected an array of countries.');
            return [];
        }

        console.log(`Fetched ${data.length} countries.`);
        return data;
    } catch (error) {
        console.error('Error fetching countries:', error instanceof Error ? error.message : error);
        return [];
    }
};
