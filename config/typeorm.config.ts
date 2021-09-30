import { createConnection } from 'typeorm'

export const environment = process.env.NODE_ENV;

export const Connection = async () => {
    try{
        await createConnection({
            type: 'postgres',
            host: process.env.HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.PASSWORD,
            database: process.env.DB,
            entities: [ "build/src/entity/**/*.js" ],
            synchronize: true,
            name: 'studaid'
        })

    }
    catch(err){ console.log(err) }
} 