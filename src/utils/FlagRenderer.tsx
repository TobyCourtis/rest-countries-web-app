import React from "react";
import {CustomCellRendererProps} from "ag-grid-react";


export default (params: CustomCellRendererProps) => (
    <span className="imgSpanLogo">
        {params.value && (
            <img
                alt={`${params.value} Flag`}
                src={`${params.value.toLowerCase()}`}
                className="flag"
            />
        )}
    </span>
)