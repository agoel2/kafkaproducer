import styles from '../styles/Home.module.css'
import {useState} from 'react'
import axios, {AxiosRequestConfig} from "axios";
import {useRouter} from "next/router";
import Link from "next/link";
import {getCookies, getCookie, setCookie, deleteCookie} from 'cookies-next';
import {Consumer} from "../components/consumerComp";
import {Loader} from "../components/loaderComp";

// @ts-ignore
export default function Home({validTopics, startConsumer, resetConsumer}) {
    const [loader, setLoader] = useState(false);
    const [messages, setMessages] = useState([]);

    return <>
        <Consumer resetConsumer={resetConsumer} startConsumer={startConsumer} validTopics={validTopics}
                  loader={loader}
                  setLoader={setLoader} messages={messages} setMessages={setMessages}></Consumer>
    </>
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
    const req = context.req;
    const res = context.res;
    // @ts-ignore
    const response = await requestSchemaRegistry(envs('')[env]);

    const validTopics = response.filter((obj: string) => obj.endsWith('-value') && !obj.includes('TABLE') && !obj.includes('confluent')).sort();

    let consumerGroupId = getCookie('consumer-group-id', {req, res});

    if (consumerGroupId === undefined) {
        setCookie('consumer-group-id', Math.random(), {req, res, maxAge: 2147483647})
    }
    consumerGroupId = getCookie('consumer-group-id', {req, res});

    return {
        props: {validTopics},
    }
}
