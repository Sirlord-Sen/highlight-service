import { EntityRepository, Repository } from 'typeorm';
import { Topic } from '../entity/topic.entity'

@EntityRepository(Topic)
export class TopicRepository extends Repository<Topic>{
    
    public async createTopic(topic: any){
        const high = await this.save(topic)
        // console.log(high)
        return high
    }

}