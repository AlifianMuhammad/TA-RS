const { defineConfig } = require("@vue/cli-service");
var externals = {
  "ol-mapbox-style": "function(){try{return olms}catch(e){return {}}}()",
  "ol-mapbox-style/stylefunction":
    "function(){try{return olms.stylefunction}catch(e){return {}}}()",
  echarts: "function(){try{return echarts}catch(e){return {}}}()",
  mapv: "function(){try{return mapv}catch(e){return {}}}()",
  elasticsearch: "function(){try{return elasticsearch}catch(e){return {}}}()",
  "@tensorflow/tfjs": "function(){try{return tf}catch(e){return {}}}()",
  "@turf/turf": "function(){try{return turf}catch(e){return {}}}()",
  "deck.gl": "(function(){try{return DeckGL}catch(e){return {}}})()",
  "luma.gl": "(function(){try{return luma}catch(e){return {}}})()",
  "webgl-debug": "(function(){try{return webgl-debug}catch(e){return {}}})()",
  xlsx: "function(){try{return XLSX}catch(e){return {}}}()",
  jsonsql: "function(){try{return jsonsql}catch(e){return {}}}()",
  cesium: "function(){try{return Cesium}catch(e){return {}}}()",
};
module.exports = defineConfig({
  configureWebpack: { externals },
  chainWebpack: (config) => {
    config.externals(externals);
  },
  transpileDependencies: true,
});
