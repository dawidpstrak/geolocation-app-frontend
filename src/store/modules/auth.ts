import axios from '@/plugins/axios';
import { IAuthState } from '@/types/store/auth/IAuthState';
import { ILoginCredentials } from '@/types/store/auth/ILoginCredentials';
import { IRegisterCredentials } from '@/types/store/auth/IRegisterCredentials';
import { LoggedUser } from '@/types/store/auth/LoggedUser';
import { ActionContext } from 'vuex';

const initialState = (): IAuthState => {
    const storedLoggedUser = localStorage.getItem('loggedUser');

    return {
        loggedUser: storedLoggedUser ? JSON.parse(storedLoggedUser) : null
    };
};

const state = (): IAuthState => initialState();

const getters = {
    loggedUser: (state: IAuthState): LoggedUser => state.loggedUser
};

const mutations = {
    SET_LOGGED_USER(state: IAuthState, loggedUser: LoggedUser): void {
        localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
        state.loggedUser = loggedUser;
    },

    SET_USER_TOKEN(state: IAuthState, token: string): void {
        localStorage.setItem('token', token);
    },

    REMOVE_USER_DATA(state: IAuthState): void {
        localStorage.removeItem('loggedUser');
        localStorage.removeItem('token');
        state.loggedUser = null;
    }
};

const actions = {
    async login({ commit }: ActionContext<IAuthState, any>, credentials: ILoginCredentials): Promise<void> {
        const {
            data: { loggedUser, jwtToken }
        } = await axios.post('/auth/login', credentials);

        commit('SET_LOGGED_USER', loggedUser);
        commit('SET_USER_TOKEN', jwtToken);
    },

    async register(vuexCtx: ActionContext<IAuthState, any>, registerFormData: IRegisterCredentials): Promise<void> {
        await axios.post('/auth/register', registerFormData);
    }
};

export default {
    state,
    getters,
    mutations,
    actions
};
