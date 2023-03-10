import {ReactElement, useState} from "react";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import {useRouter} from "next/router";
import {Loader} from "./loaderComp";
import {Environment} from "./envComp";
import {DEFAULT_ENV} from "../lib/constants";

// @ts-ignore
export function Consumer({
                             // @ts-ignore
                             validTopics,
                             // @ts-ignore
                             startConsumer,
                             // @ts-ignore
                             resetConsumer,
                             // @ts-ignore
                             loader,
                             // @ts-ignore
                             setLoader,
                             // @ts-ignore
                             messages,
                             // @ts-ignore
                             setMessages
                         }): ReactElement {
    const router = useRouter();
    const [topic, setTopic] = useState(validTopics[0].substring(0, validTopics[0].indexOf('-')));
    const [environment, setEnvironment] = useState(router.query.env ?? DEFAULT_ENV);

    const aa = messages && messages.length > 1 ? JSON.parse(messages) : [];
    return (
        <main className={styles.main}>

            {loader ? <Loader/> : ('')}

            <form onSubmit={(e) => {
                startConsumer(e, messages, setMessages, topic, environment, setLoader)
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
                    <div className={styles.buttonGrp}>
                        <button type={'submit'} className={`${styles.buttonPrim} btn btn-primary btn-lg`}>Start consumer
                        </button>
                        <button type={'button'} className={`${styles.buttonPrim} btn btn-primary btn-lg`}
                                onClick={(e) => {
                                    resetConsumer(e, setMessages)
                                }}>Reset consumer
                        </button>
                    </div>

                </div>
            </form>

            {aa && aa.length > 0 &&
                <div className={styles.messages}>

                    {
                        aa.map((d: string) => (
                            <div key={Math.random()} className={styles.msg}>{JSON.stringify(d, undefined, 4)}</div>
                        ))
                    }
                </div>
            }


        </main>
    )
        ;
}