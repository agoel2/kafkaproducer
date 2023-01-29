import {ReactElement} from "react";
import styles from "../styles/Home.module.css";

// @ts-ignore
export function Status({status}): ReactElement {
    return (<>
        <div style={{
            color: status === 'Success' ? 'green' : 'red'
        }}>
            {status}
        </div>
    </>);
}