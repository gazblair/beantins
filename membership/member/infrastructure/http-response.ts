export class HttpResponse{
    static build(status: number, message: string) {  
        return {
            'statusCode': status,
            'body': JSON.stringify({
                message: message
            })
        }
    }
}
