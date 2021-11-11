import { Connection } from 'typeorm'
import { Highlight, Topic, User } from '../entity'
import { HighlightRepository, UserRepository, TopicRepository } from '../repository'
import { pushHighlight } from './logic'
import { NoDataError, ForbiddenError, InternalError } from '../handlers/apiError'
import { 
    createHighlightInterface, 
    findUserInterface, 
    findTopicInterface, 
    updateInterface,
    highlightPopInterface
} from '../interfaces/highlight.interface'


export class HighlightService{
    private highlightRepository: HighlightRepository
    private topicRepository: TopicRepository
    private userRepository: UserRepository
    
    constructor(dbConn: Connection){
        this.highlightRepository = dbConn.getCustomRepository(HighlightRepository);
        this.topicRepository = dbConn.getCustomRepository(TopicRepository)
        this.userRepository =dbConn.getCustomRepository(UserRepository)
    }


    public async createHighlight(highlights:createHighlightInterface): Promise<any>{
        try{
            if(highlights.user_id !== highlights.userid) throw new ForbiddenError('User did not match')
            const savedHighlights = await this.highlightRepository.createHighlight(highlights.highlights)
            
            const foundTopic = await this.topicRepository.findOne(highlights.topic_id, { relations: ["highlights"] })
    
            if(foundTopic){
                foundTopic.highlights.push(...savedHighlights)
                const savedTopic = await this.topicRepository.save(foundTopic)
                const foundUser = await this.userRepository.findOne(highlights.userid, { relations: ["topics"] })
            
                foundUser?.topics.push(savedTopic)
                await this.userRepository.save(foundUser!)

                for (let highlight of savedHighlights){
                    delete highlight.created_at
                    delete highlight.updated_at
                    delete highlight.recalled
                }
                return savedHighlights
            }
            let topic = new Topic()
            topic.id = highlights.topic_id
            topic.highlights = savedHighlights
            const savedTopic = await this.topicRepository.save(topic)

            const foundUser = await this.userRepository.findOne(highlights.userid, { relations: ["topics"] })
            if(!foundUser){
                let user = new User()
                user.id = highlights.userid
                user.topics = [savedTopic]
                await this.userRepository.save(user)

                for (let highlight of savedHighlights){
                    delete highlight.created_at
                    delete highlight.updated_at
                    delete highlight.recalled
                }
                return savedHighlights
            }

            foundUser?.topics.push(savedTopic)
            await this.userRepository.save(foundUser!)

            for (let highlight of savedHighlights){
                delete highlight.created_at
                delete highlight.updated_at
                delete highlight.recalled
            }
            return savedHighlights
        }
        catch(err){ throw new InternalError('Something went wrong') }
    }

    public async findall(user: findUserInterface): Promise<any | undefined>{
        const userHighlights = (await (this.userRepository
                .createQueryBuilder('user')
                .where("user.id = :id", { id: user.user_id })
                .innerJoinAndSelect("user.topics", "topics")
                .innerJoinAndSelect("topics.highlights", "highlights")
                .getMany()))[0]

        if(!userHighlights) throw new NoDataError("The user was not found")

        let highlightTopics = pushHighlight(userHighlights)

        return {
            userId: user.user_id,
            highlightTopics
        }
    }

    public async findAllTopic(params: findTopicInterface): Promise<any>{
        const topicHighlights = await this.topicRepository
                    .createQueryBuilder('topic')
                    .where("topic.id = :id", {id: params.topic_id})
                    .innerJoinAndSelect("topic.highlights", "highlights")
                    .getMany()
        if(!topicHighlights) throw new NoDataError("The topic was found")
        
        for(let topic of topicHighlights){
            for(let highlights of topic.highlights){
                delete highlights.created_at
                delete highlights.updated_at
                delete highlights.recalled
            }
        }

        let build = {
            userId: params.user_id,
            topicId: topicHighlights[0].id,
            highlights: topicHighlights[0].highlights
        }

        return build
    }

    public async updateHighlight(highlight: updateInterface): Promise<Highlight | any>{
        const highlights = await this.highlightRepository.findOneHighlight(highlight)

        if (!highlights) throw new NoDataError('No such Highlight found')
    
        highlights.highlight = highlight.highlight
        highlights.topic_id = highlight.topic_id

        return await this.highlightRepository.updateHighlight(highlights)
    }

    public async popHighlight(highlight: highlightPopInterface): Promise<any>{
        const userHighlight = (await (this.userRepository
            .createQueryBuilder('user')
            .where("user.id = :id", { id: highlight.user_id })
            .innerJoinAndSelect("user.topics", "topics")
            .innerJoinAndSelect("topics.highlights", "highlights")
            .orderBy(`highlights.${highlight.sortBy}`, highlight.orderBy)
            .getOne()))?.topics

        if (!userHighlight) throw new NoDataError('No such User found')

        for (let topic of userHighlight){
            if(!topic.counter){
                for(let highlights of topic.highlights){
                    if(highlights.recalled === topic.recalled_set){
                        highlights.recalled = highlights.recalled! + 1
                        await this.highlightRepository.save(highlights)
                        delete highlights.recalled
                        delete highlights.created_at
                        delete highlights.updated_at
                        return highlights
                    }
                }
                topic.recalled_set = topic.recalled_set! + 1
                await this.topicRepository.save(topic) 
            }
            topic.counter = true
            await this.topicRepository.save(topic) 
        }

        for(let topic of userHighlight){
            topic.counter = false
            await this.topicRepository.save(topic) 
        }
        const counter = userHighlight[0].recalled_set

        return `You have Completed Set ${counter}`
    }

}