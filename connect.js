const mongoose=require('mongoose')

module.exports={
    async connectMongoose(){
        try {
            await mongoose.connect(process.env.MONGO_URL)
            console.log('MongoDb connected')
        } catch (error) {
            console.log(error)
        }
    }
}