import { Router } from "express"
import { authUser } from "../middleware/auth.js"
import { getAllUsers, getMessages, markMessageAsSeen, sendMessage } from "../controller/messageControllers.js";
const messageRoutes = Router();


messageRoutes.get('/users', authUser, getAllUsers )
messageRoutes.put('/mark', authUser, markMessageAsSeen )
messageRoutes.get('/:id', authUser, getMessages )
messageRoutes.post('/send/:id', authUser, sendMessage )


export default messageRoutes;
