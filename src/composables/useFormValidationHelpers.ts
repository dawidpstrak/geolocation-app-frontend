import { IUseFormValidationHelpers } from '@/types/composables/IUseFormValidationHelpers';
import { AxiosError } from 'axios';
import { ref, Ref } from 'vue';

export const useFormValidationHelpers = (): IUseFormValidationHelpers => {
    const serverErrors: Ref<string[]> = ref([]);

    const clearServerErrors = () => {
        serverErrors.value = [];
    };

    const handleServerErrors = (error: AxiosError) => {
        const errorMessage = error?.response?.data?.message;

        if (errorMessage) {
            if (typeof errorMessage === 'string') {
                serverErrors.value.push(errorMessage);
            } else if (Array.isArray(errorMessage)) {
                serverErrors.value = errorMessage;
            }
        }
    };

    return {
        serverErrors,
        clearServerErrors,
        handleServerErrors
    };
};
