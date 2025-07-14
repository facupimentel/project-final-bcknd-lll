import mongoose from "mongoose"
import Users from "../dao/Users.dao.js"
import Pets from "../dao/Pets.dao.js"
import Adoption from "../dao/Adoption.js"
import chai from "chai"
import supertest from "supertest"
import { configDotenv } from "dotenv"

configDotenv()

const expect = chai.expect
const requester = supertest('http://localhost:8080')

describe("test funcionales para el dao de adoption", ()=>{
    before(async function () {
        await mongoose.connect(process.env.MONGO_TEST)
        this.usersDao = new Users()
        this.petsDao = new Pets()
        this.adoptionsDao = new Adoption()
    })

    beforeEach(async function () {
        await mongoose.connection.collections.adoptions?.drop()
        await mongoose.connection.collections.users?.drop()
        await mongoose.connection.collections.pets?.drop()
    })

    it("GET /api/adoptions debe obtener todas las adopciones", async function () {
    const user = await this.usersDao.save({
      first_name: "facundo",
      last_name: "pimentel",
      email: "facu@pimentel.com",
      password: "hola1234"
    })

    const pet = await this.petsDao.save({
      name: "batman",
      specie: "perro",
      age: 5
    })
    await this.adoptionsDao.save({ user: user._id, pet: pet._id })

    const res = await requester.get("/api/adoptions")

    expect(res.status).to.equal(200)
    expect(res.body).to.have.property("payload")
    expect(res.body.payload).to.be.an("array")
  })

  it("GET /api/adoptions/:aid debe obtener una adopción por id", async function () {
    const user = await this.usersDao.save({
      first_name: "miguel",
      last_name: "merentiel",
      email: "miguel@merentiel",
      password: "boca1234"
    })

    const pet = await this.petsDao.save({
      name: "neuer",
      specie: "arquero",
      age: 39
    })

    const adoption = await this.adoptionsDao.save({ user: user._id, pet: pet._id })

    const res = await requester.get(`/api/adoptions/${adoption._id}`)

    expect(res.status).to.equal(200)
    expect(res.body.payload).to.have.property("_id")
    expect(res.body.payload._id).to.equal(adoption._id.toString())

  })

  it("POST /api/adoptions/:uid/:pid debe crear una adopción", async function () {
    const user = await this.usersDao.save({
      first_name: "carla",
      last_name: "fernandez",
      email: "carla@gmail.com",
      password: "hola12345"
    })

    const pet = await this.petsDao.save({
      name: "simba",
      specie: "perro",
      age: 4
    })

    const {_body} = await requester.post('/api/pets').send(pet)
    expect(_body.payload).to.have.property('_id')
    expect(_body.payload.name).to.be.equal('simba')
    
  })
})