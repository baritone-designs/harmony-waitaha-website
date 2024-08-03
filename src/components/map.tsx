/* Since the map was loaded on client side,
we need to make this component client rendered as well */

'use client';

// Map component Component from library
import { GoogleMap, Marker } from '@react-google-maps/api';

// Map's styling
const defaultMapContainerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '15px',
};

// K2's coordinates
const defaultMapCenter = {
    lat: -43.53115955331826,
    lng: 172.5705514208086,
};

// Default zoom level, can be adjusted
const defaultMapZoom = 14;

// Map options
const defaultMapOptions = {
    zoomControl: false,
    tilt: 0,
    gestureHandling: 'auto',
    disableDefaultUI: true,
    styles: [
        { elementType: 'geometry', stylers: [{ color: '#1a2536' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
        {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#9ca5b3' }],
        },
        {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#77abff' }],
        },
        {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{ color: '#154043' }],
        },
        {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#6b9a76' }],
        },
        {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#42566d' }],
        },
        {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#9ca5b3' }],
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{ color: '#4a6b96' }],
        },
        {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#9ca5b3' }],
        },
        {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{ color: '#2f3948' }],
        },
        {
            featureType: 'transit.station',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }],
        },
        {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#07090d' }],
        },
        {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#9ca5b3' }],
        },
    ],
};

// const defaultMapStyle = {
//     elementType: 'geometry', stylers: [{ color: '#242f3e' }],
// };

const MapComponent = () => (
    <div className="w-1/3">
        <GoogleMap
            mapContainerStyle={defaultMapContainerStyle}
            center={defaultMapCenter}
            zoom={defaultMapZoom}
            options={defaultMapOptions}
            // styles={defaultMapStyle}
        >
            <Marker
                position={defaultMapCenter}
            />
        </GoogleMap>

    </div>
);

export { MapComponent };
