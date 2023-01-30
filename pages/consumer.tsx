import {useState} from 'react'
import {getCookie, setCookie} from 'cookies-next';
import {Consumer} from "../components/consumerComp";
import {getTopics} from "../lib/serverProps";

// @ts-ignore
export default function Home({validTopics, startConsumer, resetConsumer}) {
    const [loader, setLoader] = useState(false);
    const [messages, setMessages] = useState([]);

    return <>
        <Consumer resetConsumer={resetConsumer} startConsumer={startConsumer} validTopics={validTopics}
                  loader={loader}
                  setLoader={setLoader} messages={messages} setMessages={setMessages}></Consumer>
    </>
}

export async function getServerSideProps(context: any) {

    const req = context.req;
    const res = context.res;

    let consumerGroupId = getCookie('consumer-group-id', {req, res});

    if (consumerGroupId === undefined) {
        setCookie('consumer-group-id', Math.random(), {req, res, maxAge: 2147483647})
    }

    return await getTopics(context);

}
