import type {AppProps} from 'next/app'
import axios from "axios";
import Head from "next/head";
import 'bootstrap/dist/css/bootstrap.css'
import '../styles/globals.css'
import RandExp from "randexp";
import {getCookie, setCookie} from 'cookies-next';
import {NavBar} from "../components/navBar";

export default function App({Component, pageProps}: AppProps) {

    // const lambdaUrl='https://p32fjbclbnmfsos6y2fvyedpma0fckit.lambda-url.eu-central-1.on.aws/';
    const lambdaUrl = 'https://4sp6tubgjaiuqfdgfxz5itmnai0xgsdo.lambda-url.eu-west-1.on.aws/';

    const requestBody = {
        url: lambdaUrl,
        auth: {
            username: 'Clarks',
            password: 'ClarksKafkaUI@123',
        },
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
    const produceMessages = async (e: any, message: any, topic: string, keySchema: string, environment: string, setLoader: any, setStatus: any) => {
        e.preventDefault();
        setLoader(true);
        try {
            const keysToIterate = JSON.parse(keySchema);
            const keyAttribute = keysToIterate.attribute;
            const secondaryKeyAttributes = keysToIterate.secondaryAttributes;
            const parsedMessage = JSON.parse(message);

            const numberOfRecords = keysToIterate.numberOfRecords;

            const newRecords = [];

            if (numberOfRecords === 1) {
                let key = parsedMessage[keyAttribute];
                if (secondaryKeyAttributes?.length >= 1) {
                    for (const secondaryKeyAttribute of secondaryKeyAttributes) {
                        key += '__' + parsedMessage[secondaryKeyAttribute];
                    }
                }
                newRecords.push({
                    key,
                    value: parsedMessage
                });
            } else {
                const emailRegex = /^[0-9a-zA-Z]{3,6}@[0-9a-zA-Z]{3,6}\.com$/;
                const numberRegex = /^[0-9]{12}$/;
                const keyRegex = keyAttribute === 'email' ? emailRegex : numberRegex;

                for (let i = 0; i < numberOfRecords; i++) {
                    const keyAttributeResolved = new RandExp(keyRegex).gen();

                    const newRecord = {
                        ...parsedMessage,
                        [keyAttribute]: keyAttributeResolved
                    };

                    let newRecordKey = keyAttributeResolved;
                    if (secondaryKeyAttributes?.length >= 1) {
                        for (const secondaryKeyAttribute of secondaryKeyAttributes) {
                            newRecordKey += '__' + parsedMessage[secondaryKeyAttribute];
                        }
                    }

                    newRecords.push({
                        key: newRecordKey,
                        value: newRecord
                    });
                }
            }

            console.log(newRecords);

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
                setStatus('Failed to produce message')
            }

            console.log('result:' + JSON.stringify(res));
        } catch (error) {
            console.error(error);
            setStatus('Failed to produce message.');
        }
        setLoader(false);
    }

    return <><Head>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
    </Head><NavBar/><Component {...pageProps} produceMessages={produceMessages} startConsumer={startConsumer}
                               resetConsumer={resetConsumer} startQuery={startQuery} lambdaUrl={lambdaUrl}/></>
}
