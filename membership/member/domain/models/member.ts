import {MemberCreatedEvent} from './member-created-event'
import {Entity} from './entity'
import {EmailAddress} from './email-address'
import {Name} from './name'

enum status {
  New = "new",
  PendingVerification = "pendingverification",
  Active = "active"
}

export class Member extends Entity {
     private emailAddress: EmailAddress
     private _name: Name
     private _joinDate: string
     private status

    constructor(email: string, name: string) {
      super()
      var currentDateTime  = new Date()

      this.emailAddress = new EmailAddress(email)
      this._name = new Name(name)
      this._joinDate = currentDateTime.toISOString()
      this.status = status.New
    }

    get email() {
      return this.emailAddress.value
    }

    get name() {
      return this._name.value
    }

    get joinDate() {
      return this._joinDate
    }

    signup() {
      if (this.status != status.New)
      {
        throw new Error('cannot signup existing member')
      }

      this.status = status.PendingVerification

      super.addEvent(new MemberCreatedEvent(this.emailAddress.value, this.id, this.joinDate))
    }

    // verify(joinDate) {
    //   // if ((this.#status != status.PENDING_VERIFICATION) &&
    //   //    (joinDate == this.#joinDate))
    //   // {
    //   //   this.#status = status.ACTIVE

    //   //   super.addEvent(new UserRegisteredEvent(this.id))
    //   // }
    // }

}
