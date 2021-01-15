/*eslint no-undef: "error"*/

import React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { Loader } from '@googlemaps/js-api-loader';

import CreateChangeMapObject from './CreateChangeMapObject';
import ObjectInfoWindow from './ObjectInfoWindow';

class Map extends React.PureComponent {

    componentDidMount() {
        (new Loader({
            apiKey: 'AIzaSyCrlTaY8NMKpZnX95mgnxzvq2xd137Y1UM'
        })).load().then(async () => {

            const { appStore } = this.props;

            appStore.map = new window.google.maps.Map(document.getElementById('map'), {
                center: {
                    lat: 50.42,
                    lng: 30.45
                },
                zoom: 12
            });
            
            appStore.googleMapsApi = window.google.maps;

            appStore.map.addListener('click', (event) => {
                appStore.setDialogComponent(<CreateChangeMapObject
                    creatingMode
                    latLng={{ lat:  event.latLng.lat(), lng: event.latLng.lng() }}
                />)
            });

            await appStore.getMilObjects();

            appStore.drawAllMarkersForObjects(appStore.allMilBases.concat(appStore.allMilWarehouses), (thisObjectType, thisObject) => appStore.setDialogComponent(<ObjectInfoWindow
                object={thisObject}
                objectType={thisObjectType}
            />))

        });
    }

    render() {
        return <MapContainer id={'map'}>

        </MapContainer>
    }

}

export default inject('appStore')(observer(Map));

const MapContainer = styled.div`
    height: 100%;
`;
