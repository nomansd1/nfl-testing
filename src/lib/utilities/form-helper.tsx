export type FormState = { statusCode?:Number, message?: string, exception?:string, data?: any };
export type FormAction = (state: FormState, formDate: FormData) => FormState | Promise<FormState>;

export function extractFields(formData: FormData) {
    let data: any = {}
    for (const key of formData.keys() as Iterable<string>) {
        const value = formData.get(key) as string | File;
        if (!key.startsWith('$'))
            data[key] = value; //loginInfo.push{[key]:value};
    }
    return data;
}