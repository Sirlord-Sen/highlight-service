import { userDto } from '../dto/highlight.dto'
import axios from 'axios'
import FormData from 'form-data'
import fs from "fs"


export class MicroService{

    public async findUser(refreshToken: string): Promise<userDto>{
        const url = 'http://studaid-gateway.herokuapp.com/api/v1/auth/permissions'
        const method = "get"
        const headers = {"Authorization": `Bearer ${refreshToken}`}
        try{
            const { data } = await axios({ headers: headers, method: method, url: url})
            return data.user
        }
        catch(err){
            if (axios.isAxiosError(err)) throw (err.response?.data)
            throw (err)
        }
    } 

    public async textDetect(user: string, topic: string, imgPath: any): Promise<Array<string>>{
        var form = new FormData();
    
        form.append('user_id', user)
        form.append("topic_id", topic)
        form.append("image", fs.createReadStream(imgPath))

        const url = 'http://127.0.0.1:5000/api/v1/text_detection/detectText'
        const method = "post"
        const contentType = form.getHeaders()
        const headers = {
            ...contentType,
            "X-Api-Key" : process.env.TEXT_DETECT_SECRET_KEY 
        }

        try{
            const { data } = await axios({ method: method, url: url, data: form, headers: headers})
            return data.data.user.highlights
        }
        catch(err){
            console.log(err)
            if (axios.isAxiosError(err)) throw (err.response?.data)
            throw (err)
        }
    }

}