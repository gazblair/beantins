import {DomainEvent} from './domain-event'

export class MemberCreatedEvent implements DomainEvent{
  email: string
  id: string
  joinDate: string
  constructor(email: string, id: string, joinDate: string) {
    this.email = email
    this.id = id
    this.joinDate = joinDate
  }
}
