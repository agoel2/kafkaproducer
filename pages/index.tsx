import Head from 'next/head'
import Image from 'next/image'
import {Inter} from '@next/font/google'
import styles from '../styles/Home.module.css'
import {useState} from 'react'
import axios, {AxiosRequestConfig} from "axios";

// @ts-ignore
export default function Home({topics, produceMessages}) {
    const validTopics = topics.filter((obj: string) => obj.endsWith('-value') && !obj.includes('TABLE')).sort();
    const [message, setMessage] = useState('');
    const [topic, setTopic] = useState(validTopics[0].substring(0, validTopics[0].indexOf('-')));
    const [keySchema, setKeySchema] = useState('');

    // @ts-ignore
    // @ts-ignore
    return (
        <>
            <main className={styles.main}>
                <form>
                    <div className="form-group">
                        <label htmlFor="topic">Topics:</label>
                        <select className="form-control" id="topic" onChange={(e) => setTopic(e.target.value)}>
                            {validTopics.map((value: string, index: any) => {
                                return <option key={value.substring(0, value.indexOf('-'))}
                                               value={value.substring(0, value.indexOf('-'))}>{value.substring(0, value.indexOf('-'))}</option>
                            })}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Key Schema:</label>
                        <textarea className="form-control" id='keySchema' name='keySchema' rows={5} cols={80}
                                  onChange={(e) => setKeySchema(e.target.value)} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Message:</label>
                        <textarea className="form-control" id='message' name='message' rows={20} cols={80}
                                  onChange={(e) => setMessage(e.target.value)} required/>
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary btn-lg" onClick={(e) => {
                            produceMessages(e, message, topic, keySchema)
                        }}>submit
                        </button>
                    </div>
                </form>
            </main>
        </>
    )
}

export async function getServerSideProps(context: any) {

    const config: AxiosRequestConfig = {
        method: 'get',
        auth: {
            username: 'L42QMEHYYDIBEMWA',
            password: 'mYAjOv+Fjvcdl+tRvyPptSJSZ3jzq7O5Rg723Qg7n2IurjTByDvECKh1XWutX5WJ',
        },
        url: 'https://psrc-p6o1m.eu-central-1.aws.confluent.cloud/subjects',
    }

    const response = await axios(config)

    return {
        props: {topics: response.data},
    }
}
