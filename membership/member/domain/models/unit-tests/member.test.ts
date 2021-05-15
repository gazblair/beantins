import {Member} from '../member'
import {MemberCreatedEvent} from '../member-created-event'

test('when signing up new member then member is created', () => {
    let member = new Member("bob@hotmail.com", "bob")

    member.signup()

    expect(member.name).toBe("bob");
    expect(member.email).toBe("bob@hotmail.com")
    
    expect(member.events.length).toBe(1);
    expect(member.events[0]).toBeInstanceOf(MemberCreatedEvent);
    expect((member.events[0] as MemberCreatedEvent).email).toBe("bob@hotmail.com");
  })

test('given an existing member when signup attempted then exception thrown', () => {
    let member = new Member("bob@hotmail.com", "bob")
    member.signup()

    let signup = function(){member.signup()}
    
    expect(() => {signup()}).toThrow('cannot signup existing member')
  });

  