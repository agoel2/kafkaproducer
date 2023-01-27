import {ReactElement} from "react";
import styles from "../styles/Home.module.css";

export function Loader(): ReactElement {
    return (<>
        <div className={styles.loading}>
            <div className={styles.loadingposition}>
                <img src="https://media.tenor.com/je-huTL1vwgAAAAi/loading-buffering.gif" height={200}
                     alt="Loading ..."/>
            </div>
        </div>
    </>);
}