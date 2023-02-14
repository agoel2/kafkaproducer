import {ReactElement} from "react";
import {useRouter} from "next/router";

// @ts-ignore
export function Environment({setEnvironment, environment}): ReactElement {
    const router = useRouter();
    return (<>
        <label htmlFor="environment">Environment:</label>
        <select className="form-control" id="environment"
                onChange={async (e) => {
                    setEnvironment(e.target.value);
                    await router.push('?env=' + e.target.value);
                }} value={environment}>
            <option value={'dev'}>dev</option>
            <option value={'shareddev'}>shareddev</option>
            <option value={'qa'}>qa</option>
            <option value={'intqa'}>intqa</option>
            <option value={'sit'}>sit</option>
            <option value={'uat'}>uat</option>
            <option value={'preprod'}>preprod</option>
        </select>
    </>);
}