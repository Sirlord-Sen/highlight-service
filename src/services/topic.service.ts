import { Connection } from 'typeorm'
import { Highlight, Topic, User } from '../entity'
import { HighlightRepository, UserRepository, TopicRepository } from '../repository'
import { NoDataError, ForbiddenError, InternalError } from '../handlers/apiError'
import { 
    createHighlightInterface, 
    findUserInterface, 
    findTopicInterface, 
    updateInterface,
    highlightPopInterface
} from '../interfaces/highlight.interface'


export class TopicService{
    private highlightRepository: HighlightRepository
    private topicRepository: TopicRepository
    private userRepository: UserRepository
    
    constructor(dbConn: Connection){
        this.highlightRepository = dbConn.getCustomRepository(HighlightRepository);
        this.topicRepository = dbConn.getCustomRepository(TopicRepository)
        this.userRepository =dbConn.getCustomRepository(UserRepository)
    }

    public async readTopics(user_id: string): Promise<Topic[] | any>{
        const userTopics = (await (this.userRepository
            .createQueryBuilder('user')
            .where("user.id = :id", { id: user_id })
            .innerJoinAndSelect("user.topics", "topics")
            .getMany()))[0]

        if(!userTopics) throw new NoDataError("The user was not found")

        return {
            userId: userTopics.id,
            topics: userTopics.topics
        }
    }

}
