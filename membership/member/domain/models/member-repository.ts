import {Member} from './member'

export interface MemberRepository {
    existsWithEmail(email: string): Promise<boolean>
    save(member: Member): Promise<void>
}
