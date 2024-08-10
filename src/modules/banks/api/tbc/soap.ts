export const accountMovementsXmlReqBody = (tbcUsername: string, tbcActualPassword: string, tbcDigipass: string, statDate: string, pageIndex: string, pageSize: string, ) => {

    return (
        `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:myg="http://www.mygemini.com/schemas/mygemini" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
            <soapenv:Header>
                <wsse:Security>
                    <wsse:UsernameToken>
                        <wsse:Username>${tbcUsername}</wsse:Username>
                        <wsse:Password>${tbcActualPassword}</wsse:Password>
                        <wsse:Nonce>${tbcDigipass}</wsse:Nonce>
                    </wsse:UsernameToken>
                </wsse:Security>
            </soapenv:Header>
            <soapenv:Body>
                <myg:GetAccountMovementsRequestIo>
                    <myg:accountMovementFilterIo>
                        <myg:pager>
                            <myg:pageIndex>${pageIndex}</myg:pageIndex>
                            <myg:pageSize>${pageSize}</myg:pageSize>
                        </myg:pager>
                        <myg:periodFrom>${statDate}</myg:periodFrom>
                    </myg:accountMovementFilterIo>
                </myg:GetAccountMovementsRequestIo>
            </soapenv:Body>
        </soapenv:Envelope>
        `
    )

}
export const accountMovementsConfig = () => {
    return(
        {
            headers: {
                "Content-Type": "text/xml",
                SoapAction:
                  `http://www.mygemini.com/schemas/mygemini/GetAccountMovements`,
              }
        }
    )
}


export const changePasswordXmlReqBody = (tbcUsername: string, tbcActualPassword: string, tbcDigipass: string, tbcNewPassword: string) => {

    return (
        `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:myg="http://www.mygemini.com/schemas/mygemini" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
            <soapenv:Header>
                <wsse:Security>
                    <wsse:UsernameToken>
                        <wsse:Username>${tbcUsername}</wsse:Username>
                        <wsse:Password>${tbcActualPassword}</wsse:Password>
                        <wsse:Nonce>${tbcDigipass}</wsse:Nonce>
                    </wsse:UsernameToken>
                </wsse:Security>
            </soapenv:Header>
            <soapenv:Body>
                <myg:ChangePasswordRequestIo>
                    <myg:newPassword>${tbcNewPassword}</myg:newPassword>
                </myg:ChangePasswordRequestIo>
            </soapenv:Body>
        </soapenv:Envelope>
        `
    )

}
export const changePassworConfig = () => {
    return(
        {
            headers: {
                "Content-Type": "text/xml",
                SoapAction:
                  `http://www.mygemini.com/schemas/mygemini/ChangePassword`,
              }
        }
    )
}
