import { Router } from 'express'
import { Connection } from 'typeorm'
import { upload } from '../middlewares/image.middleware'
import { HighlightController } from '../controller/highlight.controller'

export class HighlightRoutes{
    public router: Router;
    public highlightController: HighlightController

    constructor(dbConn: Connection){
        this.router = Router();
        this.highlightController = new HighlightController(dbConn)
        this.routes();
    }

    public routes (){
        this.router.post('/:topic_id', upload, this.highlightController.createHighlight),
        this.router.post('/:topic_id/custom_create', this.highlightController.createCustomHighlight),
        this.router.get('/', this.highlightController.readAllHighlights),
        this.router.get('/:topic_id', this.highlightController.readTopicHighlight),
        this.router.get('/single_highlight/pop_highlight', this.highlightController.popHighlight)
        this.router.put('/:topic_id/:highlight_id', this.highlightController.updateHighlight)
    }
}
