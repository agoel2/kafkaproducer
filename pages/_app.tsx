import '../styles/globals.css'
import type {AppProps} from 'next/app'
import axios from "axios";
import Head from "next/head";
import 'bootstrap/dist/css/bootstrap.css'
import {useState} from "react";

export default function App({Component, pageProps}: AppProps) {

    const addToCart = async (e: any, message: any, topic: string, key: string) => {
        e.preventDefault();
        const body = {
            topic,
            message: {
                key,
                value: JSON.parse(message)
            }
        }
        const config = {
            method: 'post',
            url: 'https://p32fjbclbnmfsos6y2fvyedpma0fckit.lambda-url.eu-central-1.on.aws/',
            data: body
        }

        let res = await axios(config)
        console.log('cart:' + JSON.stringify(res.data));
        return {
            props: {product: res.data},
        }
    }

    return <><Head>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
    </Head><Component {...pageProps} addToCart={addToCart}/></>
}
