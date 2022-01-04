<template>
    <div class="register">
        <h1> Register an account </h1>
        <form @submit.prevent="handleSubmitForm">
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
            <label for="password-repeat">Password repeat</label>
            <input
                v-model="formData.passwordRepeat"
                type="password"
                name="password-repeat"
                @input="v$.passwordRepeat.$touch"
                @blur="v$.passwordRepeat.$touch"
                @keydown="clearServerErrors"
            />
            <div v-if="v$.passwordRepeat.$error" class="error-output">
                <p v-for="error of v$.passwordRepeat.$errors" :key="error.$uid">{{ error.$message }}</p>
            </div>
            <button>Submit</button>
            <div class="error-output">
                <p v-for="(error, i) of serverErrors" :key="i">{{ error }}</p>
            </div>
        </form>

        <router-link class="link" :to="{ name: 'login' }">Sign in</router-link>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from 'vue';
import useVuelidate from '@vuelidate/core';
import { required, email, sameAs, minLength } from '@vuelidate/validators';
import { useRouter } from 'vue-router';
import { useFormValidationHelpers } from '@/composables/useFormValidationHelpers';
import { notify } from '@kyvg/vue3-notification';
import { useStore } from 'vuex';

export default defineComponent({
    name: 'Register',

    setup() {
        const formData = reactive({
            email: '',
            password: '',
            passwordRepeat: ''
        });

        const validationRules = computed(() => ({
            email: { required, email },
            password: { required, minLength: minLength(8) },
            passwordRepeat: {
                required,
                sameAsPassword: sameAs(formData.password, 'password')
            }
        }));

        const v$ = useVuelidate(validationRules, formData);

        const { serverErrors, clearServerErrors, handleServerErrors } = useFormValidationHelpers();

        const router = useRouter();
        const store = useStore();

        const handleSubmitForm = async () => {
            try {
                v$.value.$touch();

                if (!v$.value.$error) {
                    await store.dispatch('register', formData);

                    router.push({ name: 'login' });

                    notify({ title: 'Account registered', text: 'Account registered successfully' });
                }
            } catch (error) {
                handleServerErrors(error);
            }
        };

        return { formData, serverErrors, v$, handleSubmitForm, clearServerErrors };
    }
});
</script>

<style lang="scss" scoped>
.register {
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
