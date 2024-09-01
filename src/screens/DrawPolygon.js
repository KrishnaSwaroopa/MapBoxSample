import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Button,
  Dimensions,
  Text,
  FlatList,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import Geolocation from 'react-native-geolocation-service';

MapboxGL.setAccessToken(
  'sk.eyJ1Ijoic3dhcm9vcGExOTk0a3Jpc2huYSIsImEiOiJjbTBpMGJvdnMwNzY0MmtzYW5xNmdlMW93In0.lQI8ZhgUtwZjQTT_yG19zQ',
);
const DrawPolygon = () => {
  const [coordinates, setCoordinates] = useState([]); // State to hold the coordinates of the polygon
  const [drawing, setDrawing] = useState(false); // State to track drawing mode
  const [polygons, setPolygons] = useState([]); // List of all completed polygons
  const [userLocation, setUserLocation] = useState([-73.985, 40.763]); // Default location (NYC)

  useEffect(() => {
    <MapboxGL.Images key="icon" images={{assets: ['gps']}} />;

    MapboxGL.setAccessToken(
      'sk.eyJ1Ijoic3dhcm9vcGExOTk0a3Jpc2huYSIsImEiOiJjbTBpMGJvdnMwNzY0MmtzYW5xNmdlMW93In0.lQI8ZhgUtwZjQTT_yG19zQ',
    );
  }, []);
  // Request location permissions and fetch current location
  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'App needs access to your location to show your current position on the map.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          fetchCurrentLocation();
        } else {
          Alert.alert('Location permission denied');
        }
      } else {
        fetchCurrentLocation();
      }
    };

    const fetchCurrentLocation = () => {
      Geolocation.getCurrentPosition(
        position => {
          console.log('kfkdfjdf', position);
          const {latitude, longitude} = position.coords;
          setUserLocation([longitude, latitude]); // Update user's current location
        },
        error => {
          Alert.alert('Error', 'Failed to fetch your location');
          console.error(error);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    };

    requestLocationPermission();
  }, []);
  // Toggle drawing mode
  const toggleDrawing = () => {
    if (drawing && coordinates.length > 2) {
      // Save the polygon if there are enough points to form a valid polygon
      setPolygons([...polygons, coordinates]);
    }
    setDrawing(!drawing);
    if (!drawing) {
      setCoordinates([]); // Clear coordinates when starting a new drawing
    }
  };

  // Handle map press to add coordinates
  const handleMapPress = event => {
    if (drawing) {
      const {geometry} = event;
      const newCoordinates = [...coordinates, geometry.coordinates];
      setCoordinates(newCoordinates);
    }
  };
  const markers = polygons.map((polygon, index) => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: polygon[0], // First point of the polygon
    },
    properties: {
      id: index.toString(),
    },
  }));
  return (
    <View style={styles.container}>
      <MapboxGL.MapView style={styles.map} onPress={handleMapPress}>
        <MapboxGL.Camera zoomLevel={14} centerCoordinate={userLocation} />

        {coordinates.length > 2 && (
          <MapboxGL.ShapeSource
            id="polygonSource"
            shape={{
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [coordinates],
              },
            }}>
            <MapboxGL.FillLayer
              id="polygonFill"
              style={{
                fillColor: 'rgba(0, 150, 255, 0.5)',
                fillOutlineColor: 'blue',
              }}
            />
          </MapboxGL.ShapeSource>
        )}
        {polygons.map((polygon, index) => (
          <MapboxGL.ShapeSource
            key={`polygon-${index}`}
            id={`polygonSource-${index}`}
            shape={{
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [polygon],
              },
            }}>
            <MapboxGL.FillLayer
              id={`polygonFill-${index}`}
              style={{
                fillColor: 'rgba(0, 150, 0, 0.5)',
                fillOutlineColor: 'green',
              }}
            />
          </MapboxGL.ShapeSource>
        ))}
        {/* Marker Clustering Source */}
        <MapboxGL.ShapeSource
          id="clusteredMarkers"
          cluster={true} // Enable clustering
          clusterRadius={20} // Radius to cluster points (default is 50)
          clusterMaxZoom={12}
          shape={{
            type: 'FeatureCollection',
            features: markers, // Use markers generated from polygons
          }}>
          {/* Cluster Layer - shows cluster circles */}
          <MapboxGL.CircleLayer
            id="clusteredPoints"
            belowLayerID="pointCount"
            filter={['has', 'point_count']}
            style={{
              circleColor: 'red',
              circleRadius: [
                'step',
                ['get', 'point_count'],
                20, // Circle size for clusters with up to 10 points
                10,
                25, // Circle size for clusters with up to 25 points
                25,
                30, // Circle size for clusters with more than 25 points
              ],
              circleOpacity: 0.8,
            }}
          />

          {/* Text Layer - shows cluster count */}
          <MapboxGL.SymbolLayer
            id="pointCount"
            filter={['has', 'point_count']}
            style={{
              textField: ['get', 'point_count'],
              textSize: 14,
              textColor: 'white',
            }}
          />

          {/* Individual Markers */}
          <MapboxGL.SymbolLayer
            id="individualMarkers"
            filter={['!', ['has', 'point_count']]}
            style={{
              iconImage: 'marker-15', // Use default marker icon
              iconSize: 2.5,
              iconAllowOverlap: true, // Allow overlapping of markers
            }}
          />
        </MapboxGL.ShapeSource>
        {drawing
          ? coordinates.map((coord, index) => (
              <MapboxGL.PointAnnotation
                key={`point-${index}`}
                id={`point-${index}`}
                coordinate={coord}
              />
            ))
          : null}
      </MapboxGL.MapView>

      <View style={styles.buttonContainer}>
        <Button
          title={drawing ? 'Save Drawing' : 'Start Drawing'}
          onPress={toggleDrawing}
        />
      </View>
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Saved Polygons:</Text>
        <FlatList
          data={polygons}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <Text style={styles.listItem}>
              Polygon {index + 1}: {item.length} points
            </Text>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    width: windowWidth,
    height: windowHeight,
  },
  buttonContainer: {
    position: 'absolute',
    padding: 10,
    borderRadius: 5,
  },
  listContainer: {
    position: 'absolute',
    right: 0,
    top: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  listTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  listItem: {
    paddingVertical: 3,
  },
});

export default DrawPolygon;
