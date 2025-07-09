import __dirname from "./index.js"

const swaggerOptions = {
    definition:{
        openapi:'3.0.1',
        info:{
            title:'Documentacion de mi proyecto final',
            description:'api pensada en la creacion de usuarios y mascotas'
        }
    },
    apis:[`${__dirname}/docs/**/*.yaml`]
}

export default swaggerOptions