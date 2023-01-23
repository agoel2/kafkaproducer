import '../styles/globals.css'
import type {AppProps} from 'next/app'
import axios from "axios";
import Head from "next/head";
import 'bootstrap/dist/css/bootstrap.css'
import {useState} from "react";
import RandExp from "randexp";
import {useRouter} from "next/router";

export default function App({Component, pageProps}: AppProps) {
    const router = useRouter();
    const reloadEnv = async (env: string) => {

        await router.push('/?env=' + env);
    }
    const produceMessages = async (e: any, message: any, topic: string, keySchema: string, environment: string) => {
        e.preventDefault();
        const keysToIterate = JSON.parse(keySchema);
        const keyAttribute = keysToIterate.attribute;
        const secondaryKeyAttributes = keysToIterate.secondaryAttributes;
        const parsedMessage = JSON.parse(message);

        const numberOfRecords = keysToIterate.numberOfRecords;

        const newRecords = [];

        if (numberOfRecords === 1) {
            newRecords.push({
                key: parsedMessage[keyAttribute],
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
        }
        const config = {
            method: 'post',
            url: 'https://p32fjbclbnmfsos6y2fvyedpma0fckit.lambda-url.eu-central-1.on.aws/',
            data: body
        }

        let res = await axios(config)
        console.log('result:' + JSON.stringify(res.data));
    }

    return <><Head>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
    </Head><Component {...pageProps} produceMessages={produceMessages} reloadEnv={reloadEnv}/></>
}
