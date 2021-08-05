export function sleep(time: number): Promise<void> {
    return new Promise((resolve, _) => {
        setTimeout(() => resolve(), time)
    })
}

export function trimBackingFieldNames(obj: any): any{
    const result: any = {}
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            let resultKey = key;
            if(resultKey.includes("_")){
                resultKey = key.replace("_", "")
            }
            result[resultKey] = obj[key]
        }
    }
    return result
}

export function setDateFieldsToJsonStr(obj:any) {
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            if(obj[key] instanceof Date){
                obj[key] = (obj[key] as Date).toJSON()
            }
        }
    }
    return obj
}