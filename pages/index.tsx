import styles from '../styles/Home.module.css'
import {useState} from 'react'
import {useRouter} from "next/router";
import {Loader} from "../components/loaderComp";
import {Status} from "../components/statusComp";
import {getTopics} from "../lib/serverProps"
import {Environment} from "../components/envComp";
import {DEFAULT_ENV} from "../lib/constants";
// @ts-ignore
export default function Home({validTopics, produceMessages}) {

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
    const [environment, setEnvironment] = useState(router.query.env ?? DEFAULT_ENV);

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

                        <Environment environment={environment} setEnvironment={setEnvironment}/>

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
                        />

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
export async function getServerSideProps(context: any) {

    return await getTopics(context);
}
