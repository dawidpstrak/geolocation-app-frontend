import { createStore } from 'vuex';
import authModule from './modules/auth';
import geolocationsModule from './modules/geolocations';

export default createStore({
    modules: { authModule, geolocationsModule }
});
