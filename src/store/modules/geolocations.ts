import axios from '@/plugins/axios';
import { FetchCriteria } from '@/types/store/geolocations/FetchCriteria';
import { Geolocation } from '@/types/store/geolocations/Geolocation';
import { IGeolocationState } from '@/types/store/geolocations/IGeolocationsState';
import { ActionContext } from 'vuex';

const state = (): IGeolocationState => {
    return {
        geolocations: [],
        totalGeolocationsCount: 0
    };
};

const getters = {
    geolocations: (state: IGeolocationState): Geolocation[] => state.geolocations,
    totalGeolocationsCount: (state: IGeolocationState): number => state.totalGeolocationsCount
};

const mutations = {
    SET_GEOLOCATIONS(state: IGeolocationState, geolocations: Geolocation[]): void {
        state.geolocations = geolocations;
    },

    SET_TOTAL_GEOLOCATIONS_COUNT(state: IGeolocationState, totalGeolocationsCount: number): void {
        state.totalGeolocationsCount = totalGeolocationsCount;
    }
};

const actions = {
    async fetchGeolocations(
        { commit }: ActionContext<IGeolocationState, any>,
        fetchCriteria: FetchCriteria
    ): Promise<void> {
        const {
            data: { geolocations, totalGeolocationsCount }
        } = await axios.get('/geolocations', {
            params: {
                ...fetchCriteria
            }
        });

        commit('SET_GEOLOCATIONS', geolocations);
        commit('SET_TOTAL_GEOLOCATIONS_COUNT', totalGeolocationsCount);
    },

    async addGeolocation(vuexContext: ActionContext<IGeolocationState, any>, ip: string): Promise<void> {
        await axios.post(`/geolocations/`, { ip });
    },

    async deleteGeolocation(vuexContext: ActionContext<IGeolocationState, any>, id: string): Promise<void> {
        await axios.delete(`/geolocations/${id}`);
    }
};

export default {
    state,
    getters,
    mutations,
    actions
};
