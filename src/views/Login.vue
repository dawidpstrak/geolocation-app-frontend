<template>
    <div class="login">
        <h1> Login </h1>
        <form @submit.prevent="handleLogin">
            <label for="email">Email</label>
            <input
                v-model="formData.email"
                type="text"
                name="email"
                @input="v$.email.$touch"
                @blur="v$.email.$touch"
                @keydown="clearServerErrors"
            />
            <div v-if="v$.email.$error" class="error-output">
                <p v-for="error of v$.email.$errors" :key="error.$uid">{{ error.$message }}</p>
            </div>
            <label for="password">Password</label>
            <input
                v-model="formData.password"
                type="password"
                name="password"
                @input="v$.password.$touch"
                @blur="v$.password.$touch"
                @keydown="clearServerErrors"
            />
            <div v-if="v$.password.$error" class="error-output">
                <p v-for="error of v$.password.$errors" :key="error.$uid">{{ error.$message }}</p>
            </div>
            <button>Submit</button>
            <div class="error-output">
                <p v-for="(error, i) of serverErrors" :key="i">{{ error }}</p>
            </div>
        </form>

        <router-link :to="{ name: 'register' }">Dont' have an account? Register</router-link>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from 'vue';
import useVuelidate from '@vuelidate/core';
import { required, email, minLength } from '@vuelidate/validators';
import { useRouter } from 'vue-router';
import { useFormValidationHelpers } from '@/composables/useFormValidationHelpers';
import { notify } from '@kyvg/vue3-notification';
import { useStore } from 'vuex';

export default defineComponent({
    name: 'Login',

    setup() {
        const formData = reactive({
            email: '',
            password: ''
        });

        const validationRules = computed(() => ({
            email: { required, email },
            password: { required, minLength: minLength(8) }
        }));

        const v$ = useVuelidate(validationRules, formData);

        const { serverErrors, clearServerErrors, handleServerErrors } = useFormValidationHelpers();

        const router = useRouter();
        const store = useStore();

        const handleLogin = async () => {
            try {
                clearServerErrors();
                v$.value.$touch();

                if (!v$.value.$error) {
                    await store.dispatch('login', formData);

                    router.push({ name: 'geolocations' });

                    notify({ title: 'Logged in', text: 'Successfully logged in' });
                }
            } catch (error) {
                handleServerErrors(error);
            }
        };

        return { formData, serverErrors, v$, handleLogin, clearServerErrors };
    }
});
</script>

<style lang="scss" scoped>
.login {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    form {
        display: flex;
        flex-direction: column;
        max-width: 300px;
        margin: 20px 0;

        label {
            margin-top: 10px;
        }

        button {
            margin: 10px 0;
        }
    }
}
</style>
