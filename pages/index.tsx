import Head from 'next/head'
import Image from 'next/image'
import {Inter} from '@next/font/google'
import styles from '../styles/Home.module.css'
import {useState} from 'react'
import axios, {AxiosRequestConfig} from "axios";
import {useRouter} from "next/router";
import Link from "next/link";
import {Loader} from "../components/loaderComp";
import {Status} from "../components/statusComp";

// @ts-ignore
export default function Home({validTopics, produceMessages, schemas}) {

    const keySchemaPlaceholder =
        JSON.stringify({
            attribute: "product_id",//primary key attribute
            numberOfRecords: 2,//number of records to produce
            secondaryAttributes: ["channel"]//secondary key attributes
        }, undefined, 4);

    const router = useRouter();
    const [loader, setLoader] = useState(false);
    const [status, setStatus] = useState('');
    const [message, setMessage] = useState('');
    const [topic, setTopic] = useState(validTopics[0].substring(0, validTopics[0].indexOf('-')));
    const [keySchema, setKeySchema] = useState(keySchemaPlaceholder);
    const [environment, setEnvironment] = useState(router.query.env ?? 'dev');

    // @ts-ignore
    // @ts-ignore
    return (
        <>
            <main className={styles.main}>

                <Status status={status}></Status>

                {loader ? <Loader/> : ('')}

                <form onSubmit={(e) => {
                    produceMessages(e, message, topic, keySchema, environment, setLoader, setStatus)
                }}>
                    <div className="form-group">

                        <label htmlFor="environment">Environment:</label>
                        <select className="form-control" id="environment"
                                onChange={async (e) => {
                                    setEnvironment(e.target.value);
                                    await router.push('/?env=' + e.target.value);
                                }} value={environment}>
                            <option value={'dev'}>dev</option>
                            <option value={'shareddev'}>shareddev</option>
                        </select>


                        <label htmlFor="topic">Topics:</label>
                        <select className="form-control" id="topic" onChange={(e) => setTopic(e.target.value)}>
                            {validTopics.map((value: string, index: any) => {
                                return <option key={value.substring(0, value.indexOf('-'))}
                                               value={value.substring(0, value.indexOf('-'))}>{value.substring(0, value.indexOf('-'))}</option>
                            })}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="keySchema">Key Schema:</label>
                        <textarea className="form-control" id='keySchema' value={keySchema} name='keySchema' rows={8}
                                  cols={80}
                                  onChange={(e) => setKeySchema(e.target.value)} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Message:</label>
                        <textarea className="form-control" id='message' name='message' rows={20}
                                  cols={80}
                                  onChange={(e) => setMessage(e.target.value)} required
                                  placeholder={JSON.stringify(schemas[topic + '-value'], undefined, 4)}/>

                    </div>

                    <div className="form-group">
                        <div className={styles.buttonGrp}>
                            <button type={'submit'} className={`${styles.buttonPrim} btn btn-primary btn-lg`}>Produce
                            </button>
                        </div>

                    </div>
                </form>
            </main>
        </>
    )
}


const envs = (path: string) => {
    return {
        dev: {
            method: 'get',
            auth: {
                username: 'WZ7QRZNAQBDV4YQW',
                password: 'lvwGPRIww9c36DnXl6Zw69AmqkZkjj/0yFu3IT8M+KzxTWUQhWKFcox5U1ymUIrP',
            },
            url: 'https://psrc-95km5.eu-central-1.aws.confluent.cloud/subjects/' + path,
        },
        shareddev: {
            method: 'get',
            auth: {
                username: 'L42QMEHYYDIBEMWA',
                password: 'mYAjOv+Fjvcdl+tRvyPptSJSZ3jzq7O5Rg723Qg7n2IurjTByDvECKh1XWutX5WJ',
            },
            url: 'https://psrc-p6o1m.eu-central-1.aws.confluent.cloud/subjects/' + path,
        }
    }
}

async function requestSchemaRegistry(config: AxiosRequestConfig) {

    const response = await axios(config);

    return response.data;
}

export async function getServerSideProps(context: any) {

    const env = context.query?.env ?? 'dev';
    // @ts-ignore
    const response = await requestSchemaRegistry(envs('')[env]);

    const validTopics = response.filter((obj: string) => obj.endsWith('-value') && !obj.includes('TABLE') && !obj.includes('confluent')).sort();
    const schemas = {};

    for (const topic of validTopics) {
        // @ts-ignore
        const schema: string = (await requestSchemaRegistry(envs(topic + '/versions/latest')[env])).schema;
        // @ts-ignore
        schemas[topic] = schema;
    }

    return {
        props: {validTopics, schemas},
    }
}
