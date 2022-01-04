import { IConfigInterface } from '@/types/config/IConfigInterface';
import { config } from 'dotenv';

config();

const env = (key: string, defaultValue: any = null) => process.env[key] || defaultValue;

export default (): IConfigInterface => ({
    apiUrl: env('VUE_APP_API_URL')
});
