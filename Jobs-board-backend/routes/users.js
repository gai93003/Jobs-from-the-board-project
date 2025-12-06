import express from "express"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { signupValidation } from "../validation/authValidation.js";
import { signup,checkUniqEmail, usersList, getUserByEmail, getTraineesList } from "../services/authService.js";
const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

router.post("/signup",async (req, res) => {
    const {
        full_name,
        email,
        password,
        confirm_password,
        user_role,
        description,
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


// Set defaults for optional fields
const account_status = 'Pending'; // Default status for new users
const finalUserRole = user_role || 'Trainee'; // Default to Trainee if not specified
const finalDescription = description || null;
const finalMentorId = mentor_id || null;

const newUser = await signup(full_name,email,password,finalUserRole,finalDescription,account_status,finalMentorId)

 
res.status(201).json({
    message: "User created successfully",
    user: newUser,
  });
});

// Login route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        // Get user from database
        const user = await getUserByEmail(email);

        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Compare password with hash
        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                user_id: user.user_id,
                email: user.email,
                user_role: user.user_role 
            }, 
            JWT_SECRET, 
            { expiresIn: "1h" }
        );

        // Send response with token and user info
        res.json({
            message: "Login successful",
            token,
            user: {
                user_id: user.user_id,
                full_name: user.full_name,
                email: user.email,
                user_role: user.user_role,
                account_status: user.account_status
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error during login" });
    }
});


/////// Login//////////////

// router.post("/login",async (req, res) => {
//     const {
//         email,
//         password,
//     } = req.body;

// // Validation
//     const validationError = loginValidation(email, password)
//     if (validationError) {
//       return res.status(400).json({ error: validationError });
//     }

// // Check if email exists
//     const user = await findUserByEmail(email);
//   if (!user) {
//     return res.status(404).json({ error: "Email doesn't exist, please sign up" });
//     }
    
//     const isPasswordMatch = await bcrypt.compare(password, user.password_hash);

//       if (!isPasswordMatch) {
//     return res.status(401).json({ error: "Incorrect password" });
//   }

 
// res.status(200).json({
//     message: "User logged in successfully",
//     user: {
//       id: user.user_id,
//       full_name: user.full_name,
//       email: user.email,
//       user_role: user.user_role
//     },
//   });
// });


router.get("/users", async(req, res) => {
const users = await usersList();
  res.json({users});
});

router.get("/trainees", async(req, res) => {
  try {
    const trainees = await getTraineesList();
    res.json({trainees});
  } catch (error) {
    console.error("Error fetching trainees:", error);
    res.status(500).json({ error: "Failed to fetch trainees" });
  }
});




export default router;