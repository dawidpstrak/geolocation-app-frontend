import { ILoginCredentials } from './ILoginCredentials';

export interface IRegisterCredentials extends ILoginCredentials {
    passwordRepeat: string;
}
