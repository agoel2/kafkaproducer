// @ts-ignore
import axios, {AxiosRequestConfig} from "axios";
import {DEFAULT_ENV, LAMBDA_URL} from "./constants";

const axiosConfig = {
    method: 'post',
    url: LAMBDA_URL,
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

const samplesConfig = () => {
    return {
        ...axiosConfig,
        data: {
            type: 'samples',
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

export async function getSamples(context: any) {
    const response = await axios(samplesConfig());

    const samples = response.data;


    const obj = samples.reduce((acc: { [x: string]: any; }, cur: any) => {

        const key = Object.getOwnPropertyNames(cur)[0]
        acc[key] = cur;
        return acc;
    }, {});

    const topics = await getTopics(context);

    return {
        props: {samples: obj, topics: topics.props.validTopics},
    }
}

export async function getTopics(context: any) {

    const env = context.query?.env ?? DEFAULT_ENV;

    // @ts-ignore
    const response = await requestSchemaRegistry(topicsConfig(env));

    const validTopics = response.filter((obj: string) => obj.endsWith('-value') && !obj.includes('TABLE') && !obj.includes('MATERIALIZED') && !obj.includes('confluent')).sort();

    return {
        props: {validTopics},
    }
}

export async function getTables(context: any) {

    const env = context.query?.env ?? DEFAULT_ENV;
    // @ts-ignore
    const response = await requestSchemaRegistry(ksqlConfig(env));

    const tables = response[0].tables.map((table: { name: any; }) => table.name).filter((table: string | string[]) => table.includes('MATERIALIZED')).sort();

    return {
        props: {tables},
    }
}