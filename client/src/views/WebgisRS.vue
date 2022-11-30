<template>
  <div>
    <div>
      <Navbar />
      <n-card>
        <n-dropdown
          trigger="click"
          :options="spesialisList"
          @select="closestRS"
        >
          <n-button>Closest RS</n-button>
        </n-dropdown>
        <n-button @click="getCurrentLocation">GeoLocation</n-button>
        <n-space vertical>
          <n-select
            placeholder="Find Specialist or Clinic"
            filterable
            :options="spesialisListValue"
            @update:value="findSpecialist"
          />
        </n-space>
        <n-space vertical>
          <n-select
            placeholder="Find Hospital"
            filterable
            :options="rumahSakitListValue"
            @update:value="findRS"
          />
        </n-space>
      </n-card>
    </div>
    <div
      id="map"
      style="
        width: 100%;
        height: 100%;
        position: absolute;
        background-color: whitesmoke;
      "
    ></div>
  </div>
</template>

<script>
import Map from "ol/Map";
import Feature from "ol/Feature";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import { BingMaps, Vector } from "ol/source";
import VectorSource from "ol/source/Vector";
import { Layer, Vector as VectorLayer } from "ol/layer";
import { Circle as CircleStyle } from "ol/style";
import { Coordinate } from "ol/coordinate";
import {
  FeatureService,
  GetFeaturesBySQLParameters,
  TileSuperMapRest,
  TransportationAnalystResultSetting,
  TransportationAnalystParameter,
  FindClosestFacilitiesParameters,
  NetworkAnalystService,
} from "@supermap/iclient-ol";

import { GeoJSON } from "ol/format";
import { Icon, Style, Stroke, Fill, Text } from "ol/style";
import axios from "axios";
import { onMounted, ref, shallowRef, defineComponent } from "vue";
import { NButton, NDropdown, NCard, NSelect, NSpace } from "naive-ui";
import Point from "ol/geom/Point";
import Geolocation from "ol/Geolocation";
import Navbar from "../components/Navbar.vue";

export default {
  components: {
    NButton,
    NDropdown,
    NCard,
    NSelect,
    NSpace,
    Navbar,
  },
  setup() {
    let featureRS;
    let resultLayer = new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        image: new Icon({
          src: "/rs.png",
        }),
        // text: createTextStyle(feature, resolution, myDom.points),
      }),
    });

    const map = shallowRef();
    const spesialisList = ref([]);
    const spesialisListValue = ref([]);
    const rumahSakitListValue = ref([]);

    onMounted(() => {
      axios.get("http://localhost:3009/api/v1/spesialis/all").then((result) => {
        spesialisList.value = result.data.spesialisAll;
      });

      axios
        .get("http://localhost:3009/api/v1/spesialis/allvalue")
        .then((result) => {
          spesialisListValue.value = result.data.spesialisAll;
        });
      axios
        .get("http://localhost:3009/api/v1/rumahsakit/all")
        .then((result) => {
          rumahSakitListValue.value = result.data.rumahsakit;
        });
      const url =
        "http://localhost:8090/iserver/services/map-webgisRumahSakit/rest/maps/webgisRumahSakit";

      map.value = new Map({
        target: "map",
        view: new View({
          center: [110.42, -6.99],
          zoom: 13.5,
          projection: "EPSG:4326",
        }),
      });

      let layer = new TileLayer({
        source: new TileSuperMapRest({
          url: url,
          wrapX: true,
        }),
        projection: "EPSG:4326",
      });

      let bingMapLayer = new TileLayer({
        visible: true,
        preload: Infinity,
        source: new BingMaps({
          key: "Aug_jpyeictKv9-blHjr0OJOy-hYRR_5bIWhecGYlywC_F6p0LMvQ0Ye8J95tSJt",
          imagerySet: "Road",
        }),
      });
      map.value.addLayer(bingMapLayer);
      map.value.addLayer(resultLayer);

      const sqlParam = new GetFeaturesBySQLParameters({
        queryParameter: {
          name: "rumah_sakit@tugas_akhir",
          attributeFilter: "1 = 1",
        },
        datasetNames: ["tugas_akhir:rumah_sakit"],
      });

      new FeatureService(
        "http://localhost:8090/iserver/services/data-webgisRumahSakit/rest/data"
      ).getFeaturesBySQL(sqlParam, function (serviceResult) {
        // console.log(serviceResult);
        resultLayer
          .getSource()
          .addFeatures(
            new GeoJSON().readFeatures(serviceResult.result.features)
          );
        featureRS = serviceResult.result.features;
      });
    });

    return {
      spesialisList,
      spesialisListValue,
      rumahSakitListValue,
      getCurrentLocation() {
        const userFeature = new Feature();

        const geolocation = new Geolocation({
          trackingOptions: {
            enableHighAccuracy: true,
          },
          projection: map.value.getView().getProjection(),
        });

        geolocation.setTracking(true);
        console.log(geolocation);

        const geolocationPosition = geolocation.getPosition(); //UNDEFINED
        console.log(geolocationPosition);

        userFeature.setGeometry(geolocationPosition);

        const userIcon = new Style({
          image: new Icon({
            src: "/User.png",
          }),
        });
        userFeature.setStyle(userIcon);
        const geoUserSource = new Vector({
          features: [userFeature],
        });

        const geoUserLayer = new VectorLayer({
          source: geoUserSource,
        });

        map.value.addLayer(geoUserLayer);
      },

      async findSpecialist(value) {
        const res = await axios.get(
          `http://localhost:3009/api/v1/rumahsakit/spesialis/${value}`
        );
        const selected = res.data;

        const rsid = selected.data.map((r) => r.smid);
        let length = rsid.length;
        console.log(length);

        const features = featureRS.features.filter((feature) => {
          const smid = feature.properties["SMID"];
          return rsid.includes(parseInt(smid));
        });

        resultLayer.getSource().clear();
        resultLayer.getSource().addFeatures(
          new GeoJSON().readFeatures({
            type: "FeatureCollection",
            features: features,
          })
        );
        const extent = resultLayer.getSource().getExtent();

        if (length == 1) {
          const centerPoint = [
            (extent[0] + extent[2]) / 2,
            (extent[1] + extent[3]) / 2,
          ];
          map.value.getView().animate({
            zoom: 17,
            center: centerPoint,
            duration: 500,
          });
        } else {
          map.value.getView().fit(extent, { duration: 500 });
        }
      },
      async findRS(value) {
        console.log(value);
        const res = await axios.get(
          `http://localhost:3009/api/v1/rumahsakit/findRS/${value}`
        );
        const selected = res.data;
        console.log(selected);

        const rsid = selected.data.map((r) => r.smid);
        console.log(rsid);
        const features = featureRS.features.filter((feature) => {
          const smid = feature.properties["SMID"];
          return rsid.includes(parseInt(smid));
        });

        resultLayer.getSource().clear();
        resultLayer.getSource().addFeatures(
          new GeoJSON().readFeatures({
            type: "FeatureCollection",
            features: features,
          })
        );
        console.log(resultLayer);
        console.log(featureRS);
        const extent = resultLayer.getSource().getExtent();
        console.log(extent);
        const centerPoint = [
          (extent[0] + extent[2]) / 2,
          (extent[1] + extent[3]) / 2,
        ];
        // map.value.getView().fit(extent, { duration: 500 });
        map.value.getView().animate({
          zoom: 17,
          center: centerPoint,
          duration: 500,
        });
      },

      async closestRS(key) {
        const res = await axios.get(
          `http://localhost:3009/api/v1/rumahsakit/spesialis/${key}`
        );
        const selected = res.data;

        const rsid = selected.data.map((r) => r.smid);
        const features = featureRS.features.filter((feature) => {
          const smid = feature.properties["SMID"];
          return rsid.includes(parseInt(smid));
        });
        let length = rsid.length;
        // console.log(features);

        const RSIcon = new Style({
          image: new Icon({
            src: "/RSv2.png",
          }),
        });
        resultLayer.getSource().clear();
        resultLayer.getSource().addFeatures(
          new GeoJSON().readFeatures({
            type: "FeatureCollection",
            features: features,
          })
        );

        // console.log(features);

        resultLayer.setStyle(RSIcon);
        // console.log(resultLayer);
        const extent = resultLayer.getSource().getExtent();
        if (length == 1) {
          const centerPoint = [
            (extent[0] + extent[2]) / 2,
            (extent[1] + extent[3]) / 2,
          ];
          map.value.getView().animate({
            zoom: 17,
            center: centerPoint,
            duration: 500,
          });
        } else {
          map.value.getView().fit(extent, { duration: 500 });
        }
        // console.log(resultLayer, eventLayer);

        const eventPoint = new Point([110.429905, -7.066482]);
        const eventPointString = {
          x: 110.42273158614786,
          y: -6.98978946201782,
        };

        const eventFeature = new Feature(eventPoint);
        // console.log(eventFeature);

        const eventIcon = new Style({
          image: new Icon({
            src: "/User.png",
          }),
        });

        const eventSource = new Vector({
          features: [eventFeature],
        });
        // console.log(eventSource);

        const eventLayer = new VectorLayer({
          source: eventSource,
        });

        eventLayer.setStyle(eventIcon);

        map.value.addLayer(eventLayer);

        const resultSetting = new TransportationAnalystResultSetting({
          returnEdgeFeatures: true,
          returnEdgeGeometry: true,
          returnEdgeIDs: true,
          returnNodeFeatures: true,
          returnNodeGeometry: true,
          returnNodeIDs: true,
          returnPathGuides: true,
          returnRoutes: true,
        });
        // console.log(resultSetting);

        const analystParameter = new TransportationAnalystParameter({
          resultSetting: resultSetting,
          turnWeightField: "TurnCost",
          weightFieldName: "length", //length,time
        });

        const featuresGeom = features.map((r) => r.geometry);
        const featuresCoordinates = featuresGeom.map((r) => r.coordinates);

        // console.log(featuresCoordinates);
        var featuresCoordinatesObject =
          convertToArrayOfObjects(featuresCoordinates); //panggil function

        //function
        function convertToArrayOfObjects(data) {
          var output = [];
          var i = 0;
          var obj = {};
          for (i = 0; i < data.length; i++) {
            obj["x"] = data[i][1];
            obj["y"] = data[i][0];

            output.push(obj);
          }
          return output;
        }

        // console.log(featuresCoordinatesObject);

        // const obj4 = featuresCoordinates.reduce((accumulator, value, index) => {
        //   return { ...accumulator, [key + index]: value };
        // }, {});
        // console.log(obj4);

        const findClosestFacilitiesParameters =
          new FindClosestFacilitiesParameters({
            event: eventPointString,
            expectFacilityCount: 1,
            facilities: featuresCoordinatesObject,
            isAnalyzeById: false,
            parameter: analystParameter,
          });
        // console.log(findClosestFacilitiesParameters);

        new NetworkAnalystService(
          "http://localhost:8090/iserver/services/transportationAnalyst-webgisRumahSakit/rest/networkanalyst/tugas_akhir_Network@tugas_akhir"
        ).findClosestFacilities(
          findClosestFacilitiesParameters,
          function (serviceResult) {
            console.log(serviceResult);
            serviceResult.result.facilityPathList.map(function (result) {
              const vectorSource = new Vector({
                features: new GeoJSON().readFeatures(result.route),
              });

              const pathLayer = new VectorLayer({
                source: vectorSource,
                style: new Style({
                  stroke: new Stroke({
                    color: "rgba(100,100,225,10)",
                    width: 3,
                  }),
                  fill: new Fill({
                    color: "rgba(0,0,255,0.1)",
                  }),
                }),
              });
              map.value.addLayer(pathLayer);
            });
          }
        );
      },
    };
  },
};
</script>

<style>
@import "ol/ol.css";
.right {
  position: absolute;
  float: right;
  text-align: center;
}
.containerWeb {
  width: 500px;
  height: 250px;
  margin: 50px;

  display: flex;
  justify-content: center;
}
.queryForm {
  position: absolute;
  float: center;
}
</style>
