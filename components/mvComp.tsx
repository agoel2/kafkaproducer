import {ReactElement, useState} from "react";
import styles from "../styles/Home.module.css";
import {useRouter} from "next/router";
import {Loader} from "./loaderComp";
import Link from "next/link";
import {Status} from "./statusComp";

// @ts-ignore
export function MaterializedView({
                                     // @ts-ignore
                                     tables,
                                     // @ts-ignore
                                     startQuery,
                                     // @ts-ignore
                                     loader,
                                     // @ts-ignore
                                     setLoader,
                                     // @ts-ignore
                                     result,
                                     // @ts-ignore
                                     setResult
                                 }): ReactElement {
    const router = useRouter();
    const [table, setTable] = useState(tables[0]);
    const [whereClause, setWhereClause] = useState('');
    const [status, setStatus] = useState('');
    const [environment, setEnvironment] = useState(router.query.env ?? 'dev');

    const aa = result && result.length > 1 ? JSON.parse(result) : [];
    return (
        <main className={styles.main}>

            <Status status={status}></Status>
            {loader ? <Loader/> : ('')}

            <form onSubmit={(e) => {
                startQuery(e, result, setResult, table, environment, setLoader,whereClause,setStatus)
            }}>
                <div className="form-group">

                    <label htmlFor="environment">Environment:</label>
                    <select className="form-control" id="environment"
                            onChange={async (e) => {
                                setEnvironment(e.target.value);
                                await router.push('/materialized-views?env=' + e.target.value);
                            }} value={environment}>
                        <option value={'dev'}>dev</option>
                        <option value={'shareddev'}>shareddev</option>
                    </select>

                    <label htmlFor="table">Table:</label>
                    <select className="form-control" id="topic" onChange={(e) => setTable(e.target.value)}>
                        {tables.map((value: string) => {
                            return <option key={value}
                                           value={value}>{value}</option>
                        })}
                    </select>

                    <label htmlFor="whereClause">Where Clause:</label>
                    <input className="form-control" id={'whereClause'} onChange={(e) => setWhereClause(e.target.value)}/>
                    <div className={styles.buttonGrp}>
                        <button type={'submit'} className={`${styles.buttonPrim} btn btn-primary btn-lg`}>Start query
                        </button>
                    </div>

                </div>
            </form>

            {aa && aa.length > 1 &&
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