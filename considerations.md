### Considerations

- Due to the small size, countries are fetched on page refresh and cached for the session. This could be moved to local
  storage if required
- Many of ag-grid's sorting and filter features have been harnessed to avoid unnecessary double implementation
- Favourites have been built into the table as this feels like the best use of space and for ease of use
- The CountryModal for displaying all of a country's data is passed a CountryRow as props. This means all fields that
  want to be rendered in the modal have to manually be included in the Country and CountryRow types and additionally
  mapped in mapCountryToRowData(). If the users of this site wanted to see every value returned from the API, we could
  store the raw data and then search said data by country name, finally rendering all the raw JSON to the modal. 

### Future Improvements

- General design refinements such as the title, table width and layout
- Improve country modal CSS
- Much more thorough testing to ensure reliability of all functionality throughout the application