import type {AppProps} from 'next/app'
import axios from "axios";
import Head from "next/head";
import 'bootstrap/dist/css/bootstrap.css'
import '../styles/globals.css'
import RandExp from "randexp";
import {getCookie, setCookie} from 'cookies-next';
import {NavBar} from "../components/navBar";
import {KEYS} from "../lib/keys";
import {LAMBDA_URL} from "../lib/constants";

export default function App({Component, pageProps}: AppProps) {

    const requestBody = {
        url: LAMBDA_URL,
        auth: {
            username: 'Clarks',
            password: 'ClarksKafkaUI@123',
        },
    }
    const validate = async (e: any, message: any, topic: string, environment: string, setLoader: any, setStatus: any) => {
        e.preventDefault();
        setLoader(true);
        try {

            const body = {
                topic,
                env: environment,
                message: JSON.parse(message),
                type: 'validator',
            }
            const config = {
                method: 'post',
                ...requestBody,
                data: body
            }

            let res = await axios(config)

            if (res.data === 'success') {
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

            const body = {
                topic,
                env: environment,
                messages: [{
                    key: messageKey,
                    value: parsedMessage
                }],
                type: 'producer',
            }
            const config = {
                method: 'post',
                ...requestBody,
                data: body
            }

            let res = await axios(config)

            if (res.data === 'success') {
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

            const body = {
                query,
                env: environment,
                type: 'query',
            }
            const config = {
                ...requestBody,
                method: 'post',
                data: body,
            }

            let res = await axios(config)
            setResult(JSON.stringify(res.data));
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

        const body = {
            topic,
            env: environment,
            type: 'consumer',
            consumerGroupId,
        }
        const config = {
            method: 'post',
            ...requestBody,
            data: body,
        }

        let res = await axios(config)
        setMessages(JSON.stringify(res.data));
        setLoader(false);
    }
    const resetConsumer = async (e: any, setMessages: any) => {
        e.preventDefault();
        setCookie('consumer-group-id', Math.random());
        setMessages('');
    }
    const produceMessages = async (e: any, topic: string, numberOfRecords: number, environment: string, setLoader: any, setStatus: any,samples:any) => {
        e.preventDefault();
        setLoader(true);
        try {
            // @ts-ignore

            const sample = (samples?.props?.samples[topic])[topic].message.value;
            if (sample === undefined) {
                setStatus('Bulk sample data generation not yet supported for this topic.');
            } else {

                const newRecords = [];

                const emailRegex = /^[0-9a-zA-Z]{3,6}@[0-9a-zA-Z]{3,6}\.com$/;
                const numberRegex = /^[0-9]{12}$/;
                const keyRegex = (topic.includes('CUSTOMER') || topic.includes('EMAIL')) ? emailRegex : numberRegex;

                // @ts-ignore
                const keyAttributes = KEYS[topic];

                const keyAttribute = keyAttributes[0];
                const secondaryKeyAttributes = keyAttributes.slice(1);

                for (let i = 0; i < numberOfRecords; i++) {
                    const keyAttributeResolved = new RandExp(keyRegex).gen();

                    const newRecord = {
                        ...sample,
                        [keyAttribute]: keyAttributeResolved
                    };

                    let newRecordKey = keyAttributeResolved;
                    if (secondaryKeyAttributes?.length >= 1) {
                        for (const secondaryKeyAttribute of secondaryKeyAttributes) {
                            newRecordKey += '__' + sample[secondaryKeyAttribute];
                        }
                    }

                    newRecords.push({
                        key: newRecordKey,
                        value: newRecord
                    });
                }
                const body = {
                    topic,
                    env: environment,
                    messages: newRecords,
                    type: 'producer',
                }
                const config = {
                    method: 'post',
                    ...requestBody,
                    data: body
                }

                let res = await axios(config)

                if (res.data === 'success') {
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
