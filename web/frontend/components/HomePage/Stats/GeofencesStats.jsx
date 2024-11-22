import GenericCardComponent from './GenericCardComponent';
import {MapWrapper as Map} from '../MapWrapper';
import { useState } from 'react';
import { DisplayWrapper } from '../HomePage';

const GeofencesStats = ({ title, timeline }) => {
  const [selectedGeofence, setSelectedGeofence] = useState(null);
  return (
    <GenericCardComponent
      showSummarizeButton={false}
      title={title}
      w={'92vw'}
      body={
        <DisplayWrapper wrapperStyles={{ id: 'map', maxW: '92vw' }}>
          <Map
            timeline={timeline}
            selectedGeofence={selectedGeofence}
            updateGeofence={(geofence) => setSelectedGeofence(geofence)}
          />
        </DisplayWrapper>
      }
    />
  );
};

export default GeofencesStats;
