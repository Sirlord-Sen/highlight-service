import 'reflect-metadata'
import * as dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import { HighlightRoutes } from './routes/highlight.routes'
import { createConnection , getConnection } from 'typeorm'
import { Connection } from '../config/typeorm.config'


class Server {
    private app: express.Application
    private highlightRoutes: HighlightRoutes

    constructor(){
        dotenv.config()
        this.app = express()
        this.configuration()
        this.middlewares();
        this.routes()  
    }

    public async configuration(){
        this.app.set('port', process.env.PORT || 3000)
    }
    
    public middlewares(){
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));
        this.app.use('/public/uploads', express.static('public/uploads'))
    }

    public async routes(){
        await Connection()
        const dbConn = getConnection('studaid')

        this.highlightRoutes = new HighlightRoutes(dbConn);

        this.app.get('/', (req: Request, res:Response) => { res.json('It worked!')})
        this.app.use('/api/v1/highlights' , this.highlightRoutes.router)
    }

    public start (){
        const port = this.app.get('port')
        this.app.listen(port, () => { console.log(`Server is running on ${port}`) })
    }
}

const server = new Server()
server.start()