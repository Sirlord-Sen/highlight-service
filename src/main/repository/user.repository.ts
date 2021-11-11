import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entity'

@EntityRepository(User)
export class UserRepository extends Repository<User>{
    
    public async createUser(user: any){
        const high = await this.save(user)
        return high
    }

    async findUser(user_id: any): Promise<any> {
        try{
            const OneHighlight = await this.findOne(user_id)
            return OneHighlight
        }
        catch(err){ throw (err) }
      }
}