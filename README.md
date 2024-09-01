**Introduction**
This project is a React Native application that allows users to draw polygons on a Mapbox map, save the drawn polygons, and display their first points as markers with clustering enabled for improved performance and user experience.

**Features**
1.Draw Polygons: Users can draw polygons on the map by clicking or tapping points.
2.Save Polygons: Polygons can be saved and listed within the app.
3.Marker Clustering: The first point of each saved polygon is shown as a marker, with clustering for better performance on large sets of markers.
4.Visibility of First Points: The first point of each polygon remains visible even after the polygon is saved.

**Installation**
To get started follow these steps:

# 1. Clone the repository:

git clone https://github.com/KrishnaSwaroopa/MapBoxSample.git
cd MapBoxSample

# 2. Clone the repository:

npm install

# 3. Link Mapbox dependencies:

If using React Native versions below 0.60, you'll need to link dependencies manually:

react-native link @react-native-mapbox-gl/maps

For React Native 0.60 and above, linking is handled automatically.

# 4. Configure Mapbox Access Token:

Set your Mapbox access token directly in the code;

MapboxGL.setAccessToken('YOUR_MAPBOX_ACCESS_TOKEN');

# 5 Run the application:

npx react-native run-android # for Android
npx react-native run-ios # for iOS

Project Structure

/MapboxName
│
├── /android # Android-specific code
├── /ios # iOS-specific code
├── /src
│ └── /screens # Application screens
│
├── App.js # Main entry point
├── README.md # Project documentation
├── package.json # Project configuration and dependencies
└── ...

**Dependencies**

React Native: A framework for building native apps using React.
Mapbox GL: Mapbox GL JS for rendering maps in React Native applications.

"dependencies": {
"@rnmapbox/maps": "^10.1.0-rc.4",
"@turf/bbox": "^7.1.0",
"react": "17.0.2",
"react-native": "0.68.2",
"react-native-geolocation-service": "^5.3.1",
"react-native-permissions": "^4.1.5"
},

**Usage**

. Start Drawing: Click or tap the "Start Drawing" button to begin drawing a polygon.
. Add Points: Click on the map to add points to your polygon.
. Save Polygon: Click "Stop Drawing" to save the polygon. The first point of the saved polygon will be displayed as a marker.
. View Markers and Clustering: Markers from saved polygons are displayed, with clustering enabled for a better map experience.
