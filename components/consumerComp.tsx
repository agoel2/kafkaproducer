import {ReactElement, useState} from "react";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import {useRouter} from "next/router";
import {Loader} from "./loaderComp";
import {loader} from "next/dist/build/webpack/config/helpers";

// @ts-ignore
export function Consumer({validTopics, startConsumer, resetConsumer, loader,setLoader, messages, setMessages}): ReactElement {
    const router = useRouter();
    const [topic, setTopic] = useState(validTopics[0].substring(0, validTopics[0].indexOf('-')));
    const [environment, setEnvironment] = useState(router.query.env ?? 'dev');
    return (
        <main className={styles.main}>

            <h4>Producer/Consumer for Avro messages for Confluent Kafka</h4>
            {loader ? <Loader/> : ('')}

            <form onSubmit={(e) => {
                startConsumer(e, messages, setMessages, topic, environment, setLoader)
            }}>
                <div className="form-group">

                    <label htmlFor="environment">Environment:</label>
                    <select className="form-control" id="environment"
                            onChange={async (e) => {
                                setEnvironment(e.target.value);
                                await router.push('/consumer?env=' + e.target.value);
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

                    <button type={'submit'} className="btn btn-primary btn-lg">Start consumer
                    </button>
                    <button type={'button'} className="btn btn-primary btn-lg" onClick={(e) => {
                        resetConsumer(e, setMessages)
                    }}>Reset consumer
                    </button>
                    <Link href={'/'}>Switch to producer</Link>

                    {messages??[].map((d,index)=>
                         (<div key={'result'} style={{
                            height: '500px',
                            width: '500px',
                            overflow: 'scroll',
                        }}>{d}</div>)
                    )}


                    </div>
            </form>
        </main>
    );
}