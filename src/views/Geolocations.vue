<template>
    <div class="geolocations">
        <div class="top-panel">
            <div class="filter-container">
                <label for="search">Filter by any field</label>
                <input
                    v-model="table.searchTerm"
                    type="text"
                    name="search"
                    placeholder="filter by any field"
                    @input="triggerTableToUpdate"
                />
            </div>
            <div class="add-geolocation-container">
                <label for="add-geolocation">Add geolocation by ip</label>
                <input
                    v-model="ip"
                    type="text"
                    name="add-geolocation"
                    placeholder="type ip"
                    @keydown="clearServerErrors"
                />
                <button @click="handleAddGeolocation">Add geolocation</button>
                <div v-if="serverErrors.length" class="error-output">
                    <p v-for="(error, i) in serverErrors" :key="i">
                        {{ error }}
                    </p>
                </div>

                <div v-if="v$.$error" class="error-output">
                    <p v-for="error of v$.$errors" :key="error.$uid">{{ error.$message }}</p>
                </div>
            </div>
        </div>

        <table-lite
            :is-slot-mode="true"
            ref="geolocationsTableRef"
            :is-loading="table.isLoading"
            :is-re-search="table.isReSearch"
            :columns="table.columns"
            :rows="table.rows"
            :total="table.totalRecordCount"
            :messages="table.messages"
            @do-search="handleFetchGeolocations"
            @is-finished="table.isReSearch = false"
        >
            <template v-slot:actions="data">
                <button @click="handleDeleteGeolocation(data.value._id)">Delete geolocation</button>
            </template>
        </table-lite>
    </div>
</template>

<script lang="ts">
import TableLite from 'vue3-table-lite';

import { Geolocation } from '@/types/store/geolocations/Geolocation';
import { computed, defineComponent, onMounted, reactive, Ref, ref, watch } from 'vue';
import { useStore } from 'vuex';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { useFormValidationHelpers } from '@/composables/useFormValidationHelpers';
import { notify } from '@kyvg/vue3-notification';

export default defineComponent({
    name: 'Geolocations',

    components: { TableLite },

    setup() {
        const geolocationsTableRef: Ref = ref(null);
        const store = useStore();

        const ip: Ref<string> = ref('');

        const table = reactive({
            isLoading: false,
            columns: [
                {
                    label: 'ip',
                    field: 'ip',
                    width: '5%',
                    sortable: true
                },
                {
                    label: 'continent name',
                    field: 'continent_name',
                    width: '10%',
                    sortable: true
                },
                {
                    label: 'country name',
                    field: 'country_name',
                    width: '10%',
                    sortable: true
                },
                {
                    label: 'city',
                    field: 'city',
                    width: '10%',
                    sortable: true
                },
                {
                    label: 'flag',
                    field: 'location.country_flag',
                    width: '5%',
                    sortable: false,
                    display: function (row: Geolocation): string {
                        return `<img style="width: 20px;" src="${row.location.country_flag}" />`;
                    }
                },
                {
                    label: 'actions',
                    field: 'actions',
                    width: '5%',
                    sortable: false
                }
            ],
            rows: computed(() => store.getters.geolocations),
            totalRecordCount: computed(() => store.getters.totalGeolocationsCount),
            searchTerm: '',
            isReSearch: false
        });

        onMounted(async () => {
            await handleFetchGeolocations();
        });

        const handleFetchGeolocations = async (offset = 0, limit = 10, order = 'ip', sort = 'asc') => {
            try {
                table.isLoading = true;

                await store.dispatch('fetchGeolocations', {
                    skip: offset,
                    limit,
                    order,
                    sort,
                    searchTerm: table.searchTerm
                });

                table.isLoading = false;
            } catch (error) {
                console.error(error);

                table.isLoading = false;
            }
        };

        const triggerTableToUpdate = () => {
            geolocationsTableRef.value.doSort(); // Small workaround, because only way to get current fetch criterias from this table component is to triger @do-search event. Needed for proper filtering support.
        };

        const validationRules = computed(() => ({
            required
        }));

        const v$ = useVuelidate(validationRules, ip);

        const { serverErrors, clearServerErrors, handleServerErrors } = useFormValidationHelpers();

        const handleAddGeolocation = async () => {
            try {
                clearServerErrors();
                v$.value.$touch();

                if (!v$.value.$error) {
                    await store.dispatch('addGeolocation', ip.value);

                    notify({ title: 'Added', text: 'Successfully added resource', type: 'success' });

                    triggerTableToUpdate();
                }
            } catch (error) {
                handleServerErrors(error);

                console.error(error);
            }
        };

        const handleDeleteGeolocation = async (id: string) => {
            try {
                await store.dispatch('deleteGeolocation', id);

                notify({ title: 'Deleted', text: 'Successfully deleted resource', type: 'success' });

                triggerTableToUpdate();
            } catch (error) {
                console.error(error);
            }
        };

        watch(
            () => table.searchTerm,
            (searchTerm, prevSearchTerm) => {
                table.isReSearch = searchTerm !== prevSearchTerm;
            }
        );

        return {
            table,
            store,
            handleFetchGeolocations,
            triggerTableToUpdate,
            geolocationsTableRef,
            handleDeleteGeolocation,
            ip,
            handleAddGeolocation,
            v$,
            serverErrors,
            clearServerErrors
        };
    }
});
</script>

<style lang="scss" scoped>
.geolocations {
    .top-panel {
        display: flex;
        justify-content: space-between;
        padding: 20px 0;

        label,
        input {
            margin-bottom: 10px;
        }

        label {
            color: #343a40;
        }

        .filter-container,
        .add-geolocation-container {
            display: flex;
            flex-direction: column;
        }
    }
}
</style>
