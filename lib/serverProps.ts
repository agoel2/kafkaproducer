// @ts-ignore
import axios, {AxiosRequestConfig} from "axios";
import {DEFAULT_ENV} from "./constants";

const axiosConfig = {
    method: 'post',
    url: 'https://4sp6tubgjaiuqfdgfxz5itmnai0xgsdo.lambda-url.eu-west-1.on.aws/',
    auth: {
        username: 'Clarks',
        password: 'ClarksKafkaUI@123',
    },
}
const topicsConfig = (env: string) => {
    return {
        ...axiosConfig,
        data: {
            env,
            type: 'subjects',
        }
    }
}
const ksqlConfig = (env: string) => {
    return {
        ...axiosConfig,
        data: {
            env,
            type: 'query',
            queryType: 'ksql',
            query: 'SHOW TABLES'
        }
    }
}

async function requestSchemaRegistry(config: AxiosRequestConfig) {

    const response = await axios(config);

    return response.data;
}

export async function getTopics(context: any) {

    const env = context.query?.env ?? DEFAULT_ENV;

    // @ts-ignore
    const response = await requestSchemaRegistry(topicsConfig(env));

    const validTopics = response.filter((obj: string) => obj.endsWith('-value') && !obj.includes('TABLE') && !obj.includes('confluent')).sort();

    return {
        props: {validTopics},
    }
}

export async function getTables(context: any) {

    const env = context.query?.env ?? 'dev';
    // @ts-ignore
    const response = await requestSchemaRegistry(ksqlConfig(env));

    const tables = response[0].tables.map((table: { name: any; }) => table.name).filter((table: string | string[]) => table.includes('MATERIALIZED')).sort();

    return {
        props: {tables},
    }
}