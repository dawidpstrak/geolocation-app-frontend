import { AxiosError } from 'axios';
import { Ref } from 'vue';

export interface IUseFormValidationHelpers {
    serverErrors: Ref<string[]>;
    clearServerErrors: () => void;
    handleServerErrors: (error: AxiosError) => void;
}
