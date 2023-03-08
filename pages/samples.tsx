import styles from '../styles/Home.module.css'
import {useState} from 'react'
import {getSamples} from "../lib/serverProps"
import fs from 'fs';
// @ts-ignore
export default function Home({samples, topics}) {

    const [topic, setTopic] = useState(topics[0].substring(0, topics[0].indexOf('-')));

    const [sample, setSample] = useState(samples[topic]);

    // @ts-ignore
    // @ts-ignore
    return (
        <>
            <main className={styles.main}>

                <form>
                    <div className="form-group">
                        <label htmlFor="topic">Topics:</label>
                        <select className="form-control" id="topic" onChange={(e) => {
                            setTopic(e.target.value);
                            setSample(samples[e.target.value]);
                        }}>
                            {topics.map((value: string, index: any) => {
                                return <option key={value.substring(0, value.indexOf('-'))}
                                               value={value.substring(0, value.indexOf('-'))}>{value.substring(0, value.indexOf('-'))}</option>
                            })}
                        </select>
                    </div>
                    <div className={styles.messages}>
                        {sample && JSON.stringify(sample[topic]?.message?.value, undefined, 2)}
                    </div>
                </form>
            </main>
        </>
    )
}

export async function getStaticProps(context: any) {

    return getSamples(context);
}
