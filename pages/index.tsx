import Head from 'next/head'
import Image from 'next/image'
import {Inter} from '@next/font/google'
import styles from '../styles/Home.module.css'
import {useState} from 'react'

const inter = Inter({subsets: ['latin']})

// @ts-ignore
export default function Home({product, addToCart}) {
    const [message, setMessage] = useState('');
    const [topic, setTopic] = useState('');
    const [key, setKey] = useState('');

    // @ts-ignore
    // @ts-ignore
    return (
        <>
            <main className={styles.main}>


                <form>
                    <div className="form-group">
                        <label htmlFor="topic">Topics:</label>
                        <select className="form-control" id="topic" onChange={(e) => setTopic(e.target.value)}>
                            {product.filter((obj: string) => obj.endsWith('-value') && !obj.includes('TABLE')).map((value: string, index: any) => {
                                return <option key={value.substring(0, value.indexOf('-'))}
                                               value={value.substring(0, value.indexOf('-'))}>{value.substring(0, value.indexOf('-'))}</option>
                            })}

                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="key">Key:</label>
                        <input className="form-control" id="key" onChange={(e) => setKey(e.target.value)}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Message:</label>
                        <textarea className="form-control" id='message' name='message' rows={20} cols={80}
                                  onChange={(e) => setMessage(e.target.value)}/>
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary btn-lg" onClick={(e) => {
                            addToCart(e,message, topic, key)
                        }}>submit
                        </button>
                    </div>
                </form>
            </main>
        </>
    )
}

const http = require("https");


export async function getServerSideProps(context: any) {
    let headers = {
        Authorization: `Basic SVdTS1NISkpURlM3UzNEUzo5UnE4Q0s1dmRMY09DVm1qMjBqMlh2bGowZDhiUTJNemYvK3BQUjcrNGhGeUpOaUdzWThBQzBtZ1RoS1l2ZzRK`
    };
    let a = await fetch('https://psrc-8vyvr.eu-central-1.aws.confluent.cloud/subjects/', {headers: headers})
    let product = await a.json()
    return {
        props: {product: product},
    }
}

const axios = require('axios');