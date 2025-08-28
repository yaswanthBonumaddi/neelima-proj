import { GSCloudEvent, GSContext, PlainObject, GSStatus } from "@godspeedsystems/core";
export default function (ctx: GSContext) {
    const {
        inputs: {
            data: {
              user
            }
        }, 
    
    }= ctx;
    const name = user.username|| user.displayName ;
    return new GSStatus(true, 200, 'OK', 'Hello ' + name, {});  
}