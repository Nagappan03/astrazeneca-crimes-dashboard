import React, { useState, useEffect } from 'react';
import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import Card from './Card';
import StateModal from './StateModal';

const normalizeStateName = (name) => {
    const nameMap = {
        "Andaman and Nicobar": "A & N Islands",
        "Dadra and Nagar Haveli": "D&N Haveli",
        "Daman and Diu": "Daman & Diu",
        "Jammu and Kashmir": "Jammu & Kashmir",
        "Orissa": "Odisha",
        "Uttaranchal": "Uttarakhand",
        "Pondicherry": "Puducherry"
    };
    return nameMap[name] || name;
};

const INDIA_TOPO_JSON = "/india-topo.json";

const CrimeMap = () => {
    const [crimeData, setCrimeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [position, setPosition] = useState({ coordinates: [78.9629, 22.5937], zoom: 1 });

    useEffect(() => {
        fetch('/api/crimes')
            .then(response => response.json())
            .then(data => {
                setCrimeData(data);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to load crime data');
                setLoading(false);
            });
    }, []);

    const colorScale = scaleLinear()
        .domain([
            0,
            Math.max(...(crimeData.map(d => d.total_crimes) || [0]))
        ])
        .range(["#ffedea", "#ff5233"]);

    const getStateData = (stateName) => {
        const normalizedName = normalizeStateName(stateName);
        return crimeData.find(d =>
            d.state.toLowerCase() === normalizedName.toLowerCase()
        );
    };

    const handleZoomIn = () => {
        if (position.zoom >= 8) return;
        setPosition(pos => ({ ...pos, zoom: pos.zoom * 1.2 }));
    };

    const handleZoomOut = () => {
        if (position.zoom <= 0.8) return;
        setPosition(pos => ({ ...pos, zoom: pos.zoom / 1.2 }));
    };

    return (
        <Card style={{ maxWidth: '1000px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>
                Crime Dashboard (Map)
            </h1>
            <h4>Please hover on any state to view the total number of cases registered.</h4>
            <h4>Please click on any state to view their complete crime data for every year (2001 - 2021)</h4>
            {loading ? (
                <div className="flex justify-center items-center h-96">
                    <span>Loading...</span>
                </div>
            ) : error ? (
                <div className="text-red-500 p-5 text-center">{error}</div>
            ) : (
                <div className="relative">
                    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                        <button
                            onClick={handleZoomIn}
                            className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                            +
                        </button>
                        <button
                            onClick={handleZoomOut}
                            className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                            -
                        </button>
                    </div>

                    <ComposableMap
                        projection="geoMercator"
                        projectionConfig={{
                            scale: 1000,
                            center: [78.9629, 22.5937]
                        }}
                        className="h-[600px] w-full"
                    >
                        <ZoomableGroup
                            zoom={position.zoom}
                            center={position.coordinates}
                            onMoveEnd={setPosition}
                            minZoom={position.zoom}
                            maxZoom={position.zoom}
                            wheelZoom={false}
                        >
                            <Geographies geography={INDIA_TOPO_JSON}>
                                {({ geographies }) =>
                                    geographies.map(geo => {
                                        const stateData = getStateData(geo.properties.NAME_1);
                                        return (
                                            <Geography
                                                key={geo.rsmKey}
                                                geography={geo}
                                                fill={stateData ? colorScale(stateData.total_crimes) : "#EEE"}
                                                stroke="#FFF"
                                                strokeWidth={0.5}
                                                onMouseEnter={() => {
                                                    const { NAME_1 } = geo.properties;
                                                    setSelectedState({
                                                        name: NAME_1,
                                                        crimeData: getStateData(NAME_1)
                                                    });
                                                }}
                                                onMouseLeave={() => {
                                                    setSelectedState(null);
                                                }}
                                                onClick={() => {
                                                    const { NAME_1 } = geo.properties;
                                                    window.open(`/state/${encodeURIComponent(normalizeStateName(NAME_1))}`, '_blank');
                                                }}
                                                style={{
                                                    default: { outline: "none" },
                                                    hover: { fill: "#F53", outline: "none", cursor: 'pointer' },
                                                    pressed: { fill: "#E42", outline: "none" }
                                                }}
                                            />
                                        );
                                    })
                                }
                            </Geographies>
                        </ZoomableGroup>
                    </ComposableMap>

                    {selectedState && (
                        <StateModal
                            data={selectedState}
                            onClose={() => setSelectedState(null)}
                        />
                    )}
                </div>
            )}
        </Card>
    );
};

export default CrimeMap;