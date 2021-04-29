import React from 'react';
import { View, Text, Image, TouchableOpacity, Touchable } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { COLORS, FONTS, icons, SIZES, GOOGLE_API_KEY } from '../constants';
import { useDarkMode } from 'react-native-dynamic';

const OrderDelivery = ({ route, navigation }) => {
  const [restaurant, setRestaurant] = React.useState(null);
  const [streetName, setStreetName] = React.useState('');
  const [fromLocation, setFromLocation] = React.useState(null);
  const [toLocation, setToLocation] = React.useState(null);
  const [region, setRegion] = React.useState(null);
  const [duration, setDuration] = React.useState(() => Math.random() * 10 + 30);

  const isDarkMode = useDarkMode();

  React.useEffect(() => {
    let { restaurant, currentLocation } = route.params;

    let fromLoc = currentLocation.gps,
      toLoc = restaurant.location,
      street = currentLocation.streetName;

    let mapRegion = {
      latitude: (fromLoc.latitude + toLoc.latitude) / 2,
      longitude: (fromLoc.longitude + toLoc.longitude) / 2,
      latitudeDelta: Math.abs(fromLoc.latitude - toLoc.latitude) * 2,
      longitudeDelta: Math.abs(fromLoc.longitude - toLoc.longitude) * 2,
    };

    setRestaurant(restaurant);
    setFromLocation(fromLoc);
    setToLocation(toLoc);
    setRegion(mapRegion);
    setStreetName(street);
  }, []);

  const mapView = React.createRef();

  function zoomIn() {
    let newRegion = {
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: region.latitudeDelta / 2,
      longitudeDelta: region.longitudeDelta / 2,
    };

    setRegion(newRegion);
    mapView.current.animateToRegion(newRegion, 200);
  }

  function zoomOut() {
    let newRegion = {
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: region.latitudeDelta * 2,
      longitudeDelta: region.longitudeDelta * 2,
    };

    setRegion(newRegion);
    mapView.current.animateToRegion(newRegion, 200);
  }

  function renderMap() {
    const destinationMarker = () => (
      <Marker coordinate={toLocation}>
        <View
          style={{
            height: 40,
            width: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.white,
          }}>
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: COLORS.primary,
            }}>
            <Image
              source={icons.pin}
              style={{ height: 25, width: 25, tintColor: COLORS.white }}
            />
          </View>
        </View>
      </Marker>
    );

    const carIcon = () => (
      <Marker coordinate={fromLocation} anchor={{ x: 0.5, y: 0.5 }} flat={true}>
        <Image source={icons.car} style={{ height: 40, width: 40 }} />
      </Marker>
    );

    const coordinates = [fromLocation, toLocation];

    return (
      <>
        {fromLocation && toLocation ? (
          <View style={{ flex: 1 }}>
            <MapView
              ref={mapView}
              // provider={PROVIDER_GOOGLE}
              initialRegion={region}
              style={{ flex: 1 }}>
              {/* <MapViewDirections
                origin={fromLocation}
                destination={toLocation}
                apikey={GOOGLE_API_KEY}
                strokeWidth={5}
                strokeColor={COLORS.primary}
                optimizeWaypoints={true}
                onReady={result => {
                  console.log('result');
                }}
              /> */}
              {destinationMarker()}
              {carIcon()}
            </MapView>
          </View>
        ) : null}
      </>
    );
  }

  function renderDestinationHeader() {
    return (
      <View
        style={{
          position: 'absolute',
          top: 10,
          left: 0,
          right: 0,
          height: 50,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: SIZES.width * 0.9,
            paddingVertical: SIZES.padding,
            paddingHorizontal: SIZES.padding * 2,
            borderRadius: SIZES.radius,
            backgroundColor: isDarkMode ? COLORS.darkerGray : COLORS.white,
          }}>
          <Image
            source={icons.red_pin}
            style={{ width: 30, height: 30, marginRight: SIZES.padding }}
          />

          <View style={{ flex: 1 }}>
            <Text
              style={{
                ...FONTS.body3,
                color: isDarkMode ? COLORS.white : null,
              }}>
              {streetName}
            </Text>
          </View>
          <Text
            style={{ ...FONTS.body3, color: isDarkMode ? COLORS.white : null }}>
            {Math.ceil(duration)} mins
          </Text>
        </View>
      </View>
    );
  }

  function renderDeliveryInfo() {
    return (
      <View
        style={{
          position: 'absolute',
          bottom: 50,
          left: 0,
          right: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: SIZES.width * 0.9,
            paddingVertical: SIZES.padding * 3,
            paddingHorizontal: SIZES.padding * 2,
            borderRadius: SIZES.radius,
            backgroundColor: isDarkMode ? COLORS.darkerGray : COLORS.white,
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* Avatar */}
            <Image
              source={restaurant?.courier.avatar}
              style={{ width: 50, height: 50, borderRadius: 25 }}
            />
            <View style={{ flex: 1, marginLeft: SIZES.padding }}>
              {/* Name & Rating */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    ...FONTS.h4,
                    color: isDarkMode ? COLORS.white : null,
                  }}>
                  {restaurant?.courier.name}
                </Text>
                <View style={{ flexDirection: 'row' }}>
                  <Image
                    source={icons.star}
                    style={{
                      width: 18,
                      height: 18,
                      tintColor: COLORS.primary,
                      marginRight: SIZES.padding,
                    }}
                  />
                  <Text
                    style={{
                      ...FONTS.body3,
                      color: isDarkMode ? COLORS.white : null,
                    }}>
                    {restaurant?.rating}
                  </Text>
                </View>
              </View>
              {/* Restaurant name  */}
              <Text
                style={{
                  ...FONTS.body4,
                  color: isDarkMode ? COLORS.lightGray4 : null,
                }}>
                {restaurant?.name}
              </Text>
            </View>
          </View>
          {/* Buttons */}
          <View
            style={{
              flexDirection: 'row',
              marginTop: SIZES.padding * 2,
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity
              style={{
                height: 50,
                width: SIZES.width * 0.5 - SIZES.padding * 6,
                backgroundColor: COLORS.primary,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
              }}
              onPress={() => navigation.navigate('Home')}>
              <Text style={{ ...FONTS.h4, color: COLORS.white }}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: 50,
                width: SIZES.width * 0.5 - SIZES.padding * 6,
                backgroundColor: isDarkMode
                  ? COLORS.darkgray
                  : COLORS.secondary,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
              }}
              onPress={() => navigation.goBack()}>
              <Text style={{ ...FONTS.h4, color: COLORS.white }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  function renderButtons() {
    return (
      <View
        style={{
          position: 'absolute',
          bottom: SIZES.height * 0.35,
          right: SIZES.padding * 2,
          width: 60,
          height: 130,
          justifyContent: 'space-between',
        }}>
        {/* Zoom In */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: isDarkMode ? COLORS.darkerGray : COLORS.white,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => zoomIn()}>
          <Text
            style={{ ...FONTS.body1, color: isDarkMode ? COLORS.white : null }}>
            +
          </Text>
        </TouchableOpacity>
        {/* Zoom In */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: isDarkMode ? COLORS.darkerGray : COLORS.white,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => zoomOut()}>
          <Text
            style={{ ...FONTS.body1, color: isDarkMode ? COLORS.white : null }}>
            -
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {renderMap()}
      {renderDestinationHeader()}
      {renderDeliveryInfo()}
      {renderButtons()}
    </View>
  );
};

export default OrderDelivery;
