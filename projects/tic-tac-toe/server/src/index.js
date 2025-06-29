import 'dotenv/config';
import express from "express"
import cors from "cors"
import { StreamChat } from "stream-chat"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcrypt"

const api_key = process.env.API_KEY;
const api_secret = process.env.API_SECRET;
/*
express: un framework de Node.js que facilita crear servidores web
cors: un middleware que permite que tu servidor acepte peticiones de otros dominios
*/

const app = express()
// cors  hace que cualquier frontend pueda comunicarse con tu servidor 
// sin que el navegador bloquee la solicitud.
app.use(cors())
// el servidor va a poder entender datos en formato JSON que lleguen en 
// el cuerpo (body) de las peticiones HTTP (por ejemplo, de un POST).
app.use(express.json())

// Create a user an connect to the account
const serverClient = StreamChat.getInstance(api_key, api_secret)

app.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, userName, password } = req.body
        // uuid generates a random id for the user
        const userId = uuidv4()
        // bcrypt is used to hash the password of the user
        const hashedPassword = await bcrypt.hash(password, 10)
        // create the user in the database
        const token = serverClient.createToken(userId)
        res.json({ token, userId, firstName, lastName, userName, hashedPassword })
    } catch (error) {
        console.error("Signup error:", error)
        res.json(error)
    }
})

app.post("/login", async (req, res) => {
    try {
        const { userName, password } = req.body
        const { users } = await serverClient.queryUsers({ name: userName })
        if (users.length === 0) return res.json({ message: "User not found" })

        const token = serverClient.createToken(users[0].id)
        const passwordMatch = await bcrypt.compare(
            password,
            users[0].hashedPassword
        )

        if (passwordMatch) {
            res.json({
                token,
                firstName: users[0].firstName,
                lastName: users[0].lastName,
                userName,
                userId: users[0].id,
            });
        }
    } catch (error) {
        res.json(error)
    }
})

app.listen(3001, () => {
    console.log("Server is running on port 3001")
})
