import {InvalidEmailAddress} from './invalid-email-address'

export class EmailAddress {
    private emailAddress: string

    constructor(emailAddress: string) {

      if ((!emailAddress) ||
          !this.formatIsRecipientAtDomain(emailAddress))
      {
        throw new InvalidEmailAddress("invalid email format: " + emailAddress)
      }

      if (emailAddress.length > 256)
      {
        throw new InvalidEmailAddress("email cannot exceed 256 characters")
      }
      this.emailAddress = emailAddress
    }

    formatIsRecipientAtDomain(emailAddress: string)
    {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(emailAddress.toLowerCase());
    }

    get value() {
      return this.emailAddress
    }
}
