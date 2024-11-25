export interface Country {
    name: { common: string };
    flags: { png: string };
    population: number;
    languages?: { [key: string]: string };
    currencies?: { [key: string]: { name: string } };
    region: string;
}

export interface CountryRow {
    name: string;
    flag: string;
    population: number;
    languages: string;
    currency: string;
    isFavourite: boolean;
    region: string;
}

export interface CountryModalProps {
    country: CountryRow;
    onClose: () => void;
}