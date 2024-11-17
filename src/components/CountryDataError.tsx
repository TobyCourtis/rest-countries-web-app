import type { CustomNoRowsOverlayProps } from "ag-grid-react";
import React from 'react';

export default (props: CustomNoRowsOverlayProps & { noRowsMessageFunc: () => string }) => {
    return (
        <div
            role="presentation"
            className="ag-overlay-loading-center"
            style={{ backgroundColor: '#b4bebe', height: '9%' }}
        >
            <i className="far" aria-live="polite" aria-atomic="true">
                {' '}
                {props.noRowsMessageFunc()}
                <br />
                {'See console for more details and check if '}
                <a href="https://restcountries.com/" target="_blank" rel="noopener noreferrer">
                    restcountries.com
                </a>{' is down'}
            </i>
        </div>
    );
};
