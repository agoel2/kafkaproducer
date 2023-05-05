// @ts-ignore
import axios, {AxiosRequestConfig} from "axios";
import {DEFAULT_ENV, LAMBDA_HOST, LAMBDA_URL} from "./constants";
import * as AWS4 from 'aws4';

const axiosConfig = {
    host: LAMBDA_HOST,
    service: 'lambda',
    region: 'eu-west-1',
    path: '/',
    headers: {
        'x-authorization': `Basic ${Buffer.from('Clarks:ClarksKafkaUI@123').toString('base64')}`,
        'content-type': 'application/json'
    },
    method: 'POST',
    url: LAMBDA_URL,
}

function signRequest(options: any) {
    return AWS4.sign(options, {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.ACCESS_SECRET,
    })
}

const topicsConfig = (env: string) => {
    const data = {
        env,
        type: 'subjects',
    }
    const options = {
        ...axiosConfig,
        data,
        body: JSON.stringify(data)

    };

    return signRequest(options);
}

const samplesConfig = () => {

    const data = {
        type: 'samples',
    };
    const options = {
        ...axiosConfig,
        data,
        body: JSON.stringify(data)
    }

    return signRequest(options);
}
const ksqlConfig = (env: string) => {
    const data = {
        env,
        type: 'query',
        queryType: 'ksql',
        query: 'SHOW TABLES'
    }

    const options = {
        ...axiosConfig,
        data,
        body: JSON.stringify(data)

    }

    return signRequest(options);
}

async function makeRequest(config: any) {

    delete config.headers['Host']
    delete config.headers['Content-Length']
    const response = await axios(config);

    return response.data;
}

export async function getSamples(context: any) {

    const samples = await makeRequest(samplesConfig());

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
    const response = await makeRequest(topicsConfig(env));

    const validTopics = response.filter((obj: string) => obj.endsWith('-value') && !obj.includes('TABLE') && !obj.includes('MATERIALIZED') && !obj.includes('confluent')).sort();

    return {
        props: {validTopics},
    }
}

export async function getTables(context: any) {

    const env = context.query?.env ?? DEFAULT_ENV;
    // @ts-ignore
    const response = await makeRequest(ksqlConfig(env));

    const tables = response[0].tables.map((table: {
        name: any;
    }) => table.name).filter((table: string | string[]) => table.includes('MATERIALIZED')).sort();

    return {
        props: {tables},
    }
}