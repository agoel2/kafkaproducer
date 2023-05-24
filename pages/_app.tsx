import type {AppProps} from 'next/app'
import Head from "next/head";
import 'bootstrap/dist/css/bootstrap.css'
import '../styles/globals.css'
import RandExp from "randexp";
import {getCookie, setCookie} from 'cookies-next';
import {NavBar} from "../components/navBar";
import {KEYS} from "../lib/keys";
import {LAMBDA_HOST, LAMBDA_URL} from "../lib/constants";
import * as AWS4 from "aws4";
import axios from "axios";

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
        accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY,
        secretAccessKey: process.env.NEXT_PUBLIC_ACCESS_SECRET,
    })
}

async function makeRequest(config: any) {

    delete config.headers['Host']
    delete config.headers['Content-Length']
    const response = await axios(config);

    return response.data;
}

export default function App({Component, pageProps}: AppProps) {

    const validate = async (e: any, message: any, topic: string, environment: string, setLoader: any, setStatus: any) => {
        e.preventDefault();
        setLoader(true);
        try {

            const data = {
                topic,
                env: environment,
                message: JSON.parse(message),
                type: 'validator',
            }
            const config = {
                ...axiosConfig,
                body: JSON.stringify(data),
                data
            }

            let res = await makeRequest(signRequest(config));

            if (res === 'success') {
                setStatus('Valid message')
            } else {
                setStatus('Invalid message')
            }
        } catch (error) {
            console.error(error);
            setStatus('Invalid message.');
        }
        setLoader(false);
    }
    const produceMessagesNew = async (e: any, message: any, topic: string, environment: string, setLoader: any, setStatus: any) => {
        e.preventDefault();
        setLoader(true);
        try {
            // @ts-ignore
            const keyAttributes: [] = KEYS[topic];

            const parsedMessage = JSON.parse(message);
            let messageKey = (Math.trunc(Math.random() * 20) + 1).toString();
            if (keyAttributes && keyAttributes.length > 0) {
                messageKey = keyAttributes.map((keyAttribute) => parsedMessage[keyAttribute]).join('__');
            }

            const data = {
                topic,
                env: environment,
                messages: [{
                    key: messageKey,
                    value: parsedMessage
                }],
                type: 'producer',
            }
            const config = {
                ...axiosConfig,
                body: JSON.stringify(data),
                data
            }

            let res = await makeRequest(signRequest(config))

            if (res === 'success') {
                setStatus('Success')
            } else {
                setStatus('Failed to produce message')
            }
        } catch (error) {
            console.error(error);
            setStatus('Failed to produce message.');
        }
        setLoader(false);
    }

    const startQuery = async (e: any, result: any, setResult: any, table: string, environment: string, setLoader: any, whereClause: string, setStatus: any) => {
        e.preventDefault();
        setLoader(true);

        try {
            let query = 'SELECT * FROM ' + table;
            if (whereClause && whereClause !== '') {
                query = query + ' WHERE ' + whereClause
            }

            const data = {
                query,
                env: environment,
                type: 'query',
            }
            const config = {
                ...axiosConfig,
                data,
                body: JSON.stringify(data),
            }

            let res = await makeRequest(signRequest(config))
            setResult(JSON.stringify(res));
            setStatus('Success');
        } catch (error) {
            console.error(error);
            setResult([]);
            setStatus('Error while fetching data');
        }
        setLoader(false);
    }

    const startConsumer = async (e: any, messages: any, setMessages: any, topic: string, environment: string, setLoader: any) => {
        e.preventDefault();
        setLoader(true);

        let consumerGroupId = getCookie('consumer-group-id');

        const data = {
            topic,
            env: environment,
            type: 'consumer',
            consumerGroupId,
        }
        const config = {
            ...axiosConfig,
            data,
            body: JSON.stringify(data),
        }

        let res = await makeRequest(signRequest(config))
        setMessages(JSON.stringify(res));
        setLoader(false);
    }
    const resetConsumer = async (e: any, setMessages: any) => {
        e.preventDefault();
        setCookie('consumer-group-id', Math.random());
        setMessages('');
    }
    const produceMessages = async (e: any, topic: string, numberOfRecords: number, environment: string, setLoader: any, setStatus: any, samples: any) => {
        e.preventDefault();
        setLoader(true);
        try {
            // @ts-ignore

            const sample = (samples?.props?.samples[topic])[topic].message.value;
            if (sample === undefined) {
                setStatus('Bulk sample data generation not yet supported for this topic.');
            } else {

                const data = {
                    topic,
                    env: environment,
                    numberOfRecords,
                    // @ts-ignore
                    keyAttributes: KEYS[topic],
                    sample,
                    type: 'generator',
                }
                const config = {
                    ...axiosConfig,
                    data,
                    body: JSON.stringify(data),
                }

                let res = await makeRequest(signRequest(config))

                if (res === 'success') {
                    setStatus('Success')
                } else {
                    setStatus('Failed to generate sample data')
                }
            }
        } catch (error) {
            console.error(error);
            setStatus('Failed to generate sample data.');
        }

        setLoader(false);
    }

    return <><Head>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
    </Head><NavBar/><Component {...pageProps} produceMessages={produceMessages} produceMessagesNew={produceMessagesNew}
                               startConsumer={startConsumer}
                               validate={validate}
                               resetConsumer={resetConsumer} startQuery={startQuery} lambdaUrl={LAMBDA_URL}/></>
}
