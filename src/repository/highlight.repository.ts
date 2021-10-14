import { EntityRepository, getConnection, Repository } from 'typeorm';
import { Highlight } from '../entity/highlight.entity'
import { InternalError, NoDataError, BadRequestError } from '../handlers/apiError'
import { findUserInterface, findTopicInterface, updateInterface } from '../interfaces/highlight.interface'

@EntityRepository(Highlight)
export class HighlightRepository extends Repository<Highlight>{
    private highlightRepository:Repository<Highlight>

    constructor(){
        super()
        this.highlightRepository = getConnection('studaid').getRepository(Highlight)
    }

    async createHighlight(highlights:string[]): Promise<Highlight[]> {    
        try {
            var result = []
            for (let highlightText of highlights){
                const highlight = new Highlight()
                highlight.highlight = highlightText
            
                const savedHighlight = await this.highlightRepository.save(highlight)
                result.push(savedHighlight)
            }
            return result 
        } 
        catch (e) { throw new InternalError('Highlight could not be saved')}
    }

    async updateHighlight(highlight:Highlight): Promise<Highlight>{
        try{
            const updatedHighlight = await this.highlightRepository.save(highlight)
            return updatedHighlight
        }
        catch(e) { throw new InternalError('Highlight could not be updated')}
    }

    async findAllHighlights(user: findUserInterface): Promise<Highlight[]> {
      try{
          const highlights = await this.highlightRepository.find({where: {user_id: user.user_id}})

          if(!highlights.length) throw new BadRequestError('User not registered')
          return highlights
      }
      catch(err){ throw new InternalError('Could not find highlights') }
    }

    async findTopicHighlights(params: findTopicInterface): Promise<Highlight[]> {
      try{
          const highlights = await this.highlightRepository.find({where: {user_id: params.user_id} && {topic_id: params.topic_id}})
          return highlights
      }
      catch(err){ throw (err) }
    }

    async findOneHighlight(highlight: updateInterface): Promise<Highlight | any> {
      try{
          const OneHighlight = await this.highlightRepository.findOne(highlight.highlight_id)
          return OneHighlight
      }
      catch(err){ throw (err) }
    }
}