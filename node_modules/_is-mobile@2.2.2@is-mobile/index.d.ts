interface HttpRequestHeadersInterfaceMock {
    [id: string]: string | string[] | undefined
}

interface HttpRequestInterfaceMock {
    headers: HttpRequestHeadersInterfaceMock,

    [id: string]: any,
}

export interface IsMobileOptions
{
    ua?: string | HttpRequestInterfaceMock
    tablet?: boolean
    featureDetect?: boolean
}

export declare function isMobile(opts?:IsMobileOptions): boolean;
export default isMobile;
