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
        this.router.post('/:user_id/:topic_id', upload, this.highlightController.createHighlight),
        this.router.post('/:user_id/:topic_id/custom_create', this.highlightController.createCustomHighlight),
        this.router.get('/:user_id', this.highlightController.readAllHighlights),
        // this.router.get('/:user_id/topics', this.highlightController.readTopics),
        this.router.get('/:user_id/:topic_id', this.highlightController.readTopicHighlight),
        this.router.get('/:user_id/single_highlight/pop_highlight', this.highlightController.popHighlight)
        this.router.put('/:user_id/:topic_id/:highlight_id', this.highlightController.updateHighlight)
    }
}
