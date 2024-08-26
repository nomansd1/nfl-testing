'use server'

import { LOGIN_URL } from "@/lib/constants/Constants";
import { enCookie, setCookieWithDefaults } from "@/lib/utilities/cookies-helper";
import { extractFields, FormState } from "@/lib/utilities/form-helper";

export async function loginUser(prevState: FormState, formData: FormData): Promise<FormState> {
    let credentials = extractFields(formData);

    let response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(credentials)
    });
    
    let result = await response.json() as FormState;

    if (result.statusCode === 0) {

        setCookieWithDefaults(enCookie.auth, JSON.stringify({
            token: result.data.token,
            container: result.data.loggedInUserInfo.settings.containerInfo
        }));
        //setCookieWithDefaults(enCookie.container, JSON.stringify(result.data.loggedInUserInfo.settings.containerInfo));

        result.data.token = "";
    }

    return result;

}
