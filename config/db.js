import { connect } from "mongoose";


export const db = async()=>{
    try{
        const {connection:{host}} = await connect(process.env.DBURI);
        console.log(`Database connection ${host}`);
    }
    catch{
        process.exit(1);
    }
}