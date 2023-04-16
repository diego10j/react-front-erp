

export function isDefined(value: any): boolean {
    return typeof value !== "undefined" && value !== null;
}


export function toString(value: any): string {
    return (typeof value === "undefined") ? '' : value;
}

/**
 * Remplaza los valores null de un objeto por emprty 
 * @param value 
 * @returns 
 */
export function getObjectFormControl(value: object): object {
    const cloneObjUpdate: any = { ...value };
    Object.keys(value).forEach(key => {
        if (cloneObjUpdate[key] === null) cloneObjUpdate[key] = '';
    });
    return cloneObjUpdate;
}