import express from "express"
import { signupValidation } from "../validation/authValidation.js";
import { signup,checkUniqEmail, usersList } from "../services/authService.js";
const router = express.Router()

router.post("/signup",async (req, res) => {
    const {
        full_name,
        email,
        password,
        confirm_password,
        user_role,
        description,
        account_status,
        mentor_id
    } = req.body;

// Validation
    const validationError = signupValidation(full_name,email, password,confirm_password)
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

// Check if email exists
    const exists = await checkUniqEmail(email);

    if (exists) {
      return res.status(409).json({ error: "Email already registered" });
    }

const newUser = await signup(full_name,email,password,user_role,description,account_status || 'Pending',mentor_id)
 
res.status(201).json({
    message: "User created successfully",
    user: newUser,
  });
});



router.get("/users", async(req, res) => {
const users = await usersList();
  res.json({users});
});




export default router;