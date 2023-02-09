import {ReactElement} from "react";
import styles from "../styles/Home.module.css";

const greenStatus = ['Success', 'Valid message'];

// @ts-ignore
export function Status({status}): ReactElement {
    return (<>
        <div style={{
            color: greenStatus.includes(status) ? 'green' : 'red'
        }}>
            {status}
        </div>
    </>);
}