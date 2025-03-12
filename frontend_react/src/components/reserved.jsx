import React from "react"

function Reserved({accounts}){
    return(<>

        { accounts && (
        <div className="d-flex justify-content-around flex-column p-1 col-md-5 m-1 shadow overflow-auto" style={{maxHeight: "200px"}}>
            { accounts.map((account, i) => (
            <div  key={i} className="reserve bg-white shadow  rounded-lg p-2 pl-4 pr-5 text-white mb-1">
                <span className="h6 text-primary">{account.bankName}</span><br />
                <span className="text-secondary">Account Name:<span className="text-secondary float-right">{account.accountName}</span></span><br />
                <span className="text-secondary">Account Number:<span className="text-secondary float-right">{account.accountNumber}</span></span><br />
            </div>
            )
        )}

         </div>
         )}
        </>)
    }

export default Reserved