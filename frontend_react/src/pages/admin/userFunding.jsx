import React, {useState} from "react"
import ManualFunding from "../../components/manualFunding"

function UserFunding() {
    const [reload, setReload] = useState(true)
    const reRender = () => setReload(r => !r);

    return(<div className="mx-4">
        <ManualFunding  status={reRender}/>
        </div>)
    }

export default UserFunding