// @flow

export interface RegistrationService {

    createNewUser({
                      accessToken?: string,
                      providerUserId?: string,
                      displayName?: string,
                      provider?: string,
                      emails?: Array,
                      primaryEmail?: string,
                      username?: string,
                      metaData?: Object,
                  }): Promise<string>;

    createNewUserWithEmailPass({ email: string, password: string }): Promise<string>;

    verifyEmail(token: string): Promise<Object>;

    resendVerificationEmail({ userId: string, email: string }): Promise<void>;

}

export type Interface = RegistrationService;
