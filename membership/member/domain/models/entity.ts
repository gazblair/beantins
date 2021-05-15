import {DomainEvent} from './domain-event'

import { v4 as uuidv4 } from 'uuid';

export class Entity{
  
    private _id: string
    private domainEvents: Array<DomainEvent>

    constructor (){
       this._id = uuidv4()
       this.domainEvents = new Array()
    }

    addEvent(event: DomainEvent){
      this.domainEvents.push(event)
    }

    get events() {
      return this.domainEvents;
    }

    get id() {
      return this._id;
    }
}
