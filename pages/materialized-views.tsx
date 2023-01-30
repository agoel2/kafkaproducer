import {useState} from 'react'
import {MaterializedView} from "../components/mvComp";
import {getTables} from "../lib/serverProps";

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

export async function getServerSideProps(context: any) {

    return await getTables(context);
}
