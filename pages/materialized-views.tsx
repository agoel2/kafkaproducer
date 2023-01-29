import {useState} from 'react'
import axios, {AxiosRequestConfig} from "axios";
import {MaterializedView} from "../components/mvComp";

// @ts-ignore
export default function Home({tables, startQuery}) {
    const [loader, setLoader] = useState(false);
    const [result, setResult] = useState([]);

    return <>
        <MaterializedView startQuery={startQuery} tables={tables}
                          loader={loader}
                          setLoader={setLoader} result={result} setResult={setResult}></MaterializedView>
    </>
}

const envs = () => {
    return {
        dev: {
            method: 'post',
            auth: {
                username: 'AKZZMOGKNKK7V4CK',
                password: 'zb5TIMqvqqzsYerNvVYIrIfm4vmpGuFmFCcDb1TAdm86WslypqpW0xRV/oZEDiTi',
            },
            url: 'https://pksqlc-g3rov.eu-west-1.aws.confluent.cloud:443/ksql',
            data: {
                "ksql": "SHOW TABLES;",
                "streamsProperties": {}
            }
        },
        shareddev: {
            method: 'post',
            auth: {
                username: 'J4V44GA62TRONRVB',
                password: 'KCdoZVUGJeAnl8FEX1zmtdc2iFfMb91tU7VFZTRTK+IuyYHcFiG93MgEhYVr7QBZ',
            },
            url: 'https://pksqlc-dpxmy.eu-west-1.aws.confluent.cloud:443/ksql',
            data: {
                "ksql": "SHOW TABLES;",
                "streamsProperties": {}
            }
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
    const response = await requestSchemaRegistry(envs()[env]);

    const tables = response[0].tables.map((table: { name: string; }) => table.name).filter((table: string | string[]) => table.includes('MATERIALIZED')).sort();

    return {
        props: {tables},
    }
}
