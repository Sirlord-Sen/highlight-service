import { Request, Response } from 'express'
import { HighlightService } from '../services/highlight.service'
import { Connection } from 'typeorm'
import { MicroService } from '../handlers/highlight.handlers'

import { SuccessResponse } from '../handlers/apiResponse'
import { 
    createDto, 
    createCustomDto, 
    UpdateDto,
    CRequest,
    popQueryDto
} from '../dto/highlight.dto'

export class HighlightController{
    private highlightService: HighlightService; 
    private microService: MicroService

    constructor(dbConn: Connection){
        this.highlightService = new HighlightService(dbConn)
        this.microService = new MicroService()
    }

    public createHighlight = async (
        req: CRequest<createDto> , 
        res: Response): Promise<any> => {
        try{
            const imgPath = req.file.path
            const { topic_id, user_id } = JSON.parse(JSON.stringify(req.body))
            const refreshToken = req.headers.authorization?.split('Bearer ')[1].trim()!
            const userid = (await (this.microService.findUser(refreshToken))).id
            const highlights = await this.microService.textDetect(userid, topic_id, imgPath)
            const Highlights = {user_id, userid,  topic_id, highlights}
            const saveHighlight = await this.highlightService.createHighlight(Highlights)

            new SuccessResponse('success', saveHighlight).send(res)
        }
        catch(err){ res.json(await err) }
    }

    public createCustomHighlight = async (
        req: CRequest<createCustomDto>, 
        res: Response):Promise<any> => {
        try{
            const { highlight, topic_id, user_id } = req.body
            const highlights = [highlight]
            const refreshToken = req.headers.authorization?.split('Bearer ')[1].trim()!
            const userid = (await (this.microService.findUser(refreshToken))).id
            const Highlights = {user_id, userid, topic_id, highlights}
            const saveHighlight = await this.highlightService.createHighlight(Highlights)
            new SuccessResponse('success', saveHighlight).send(res)
        }
        catch(err){ res.json(await err) }
        
    }

    public readAllHighlights = async (req: Request, res: Response):Promise<any> => {
        try{
            const refreshToken = req.headers.authorization?.split('Bearer ')[1].trim()!
            const user_id = (await (this.microService.findUser(refreshToken))).id
            const user = await this.highlightService.findall({user_id})
            
            new SuccessResponse('success', user).send(res)
        }
        catch(err) { res.json(await err) }
    }

    public readTopicHighlight = async (req: Request, res: Response) => {
       try{
            const refreshToken = req.headers.authorization?.split('Bearer ')[1].trim()!
            const user_id = (await (this.microService.findUser(refreshToken))).id
            const { topic_id } = req.params
            const findParams = { user_id, topic_id }
            const highlights = await this.highlightService.findAllTopic(findParams)
        
            new SuccessResponse('success', highlights).send(res)
       }
       catch (err) {res.json(err)}
    }

    public popHighlight = async (req: Request, res: Response) => {
        try{
            const refreshToken = req.headers.authorization?.split('Bearer ')[1].trim()!
            const user_id = (await (this.microService.findUser(refreshToken))).id
            let order = (req.query.orderBy ? String(req.query.orderBy): "ASC").toUpperCase(),
                sortBy = (req.query.sortBy ? String(req.query.sortBy) : 'created_at').toLowerCase()

            const orderBy = order as 'ASC' | 'DESC' | undefined
            
            const popParams: popQueryDto = {sortBy, orderBy, user_id}
            const popHighlight = await this.highlightService.popHighlight(popParams)
            new SuccessResponse('sucess', popHighlight).send(res)
        }
        catch (err) { res.json(err)}

    }

    public updateHighlight = async (req: CRequest<createCustomDto>, res: Response) => {
        try{
            const { highlight, topic_id } = req.body
            const refreshToken = req.headers.authorization?.split('Bearer ')[1].trim()!
            const user_id = (await (this.microService.findUser(refreshToken))).id
            const { highlight_id } = req.params
            const params: UpdateDto = {highlight, highlight_id, topic_id, user_id}
            const updatedHighlight = await this.highlightService.updateHighlight(params)
        
            new SuccessResponse('sucess', updatedHighlight).send(res)
        }
        catch(err){res.json(err)}
    }


}
