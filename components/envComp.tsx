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
            <option value={'intqa'}>intqa (Integration QA)</option>
            <option value={'qa'}>qa (Grid ES QA)</option>
        </select>
    </>);
}