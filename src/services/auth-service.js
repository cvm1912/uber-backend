const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { findUserByEmail, createUser } = require('../repositories/auth-repository');
const { ValidationError, UnauthorizedError } = require("../utils/AppError");
const { sendOTP, verifyOTP } = require("./otp-service");

// ─── Generate JWT Token ────────────────────────────────────────────────────

const generateToken = (user)=>{
   return jwt.sign({
       userId: user._id,
       email: user.email,
       role: user.role,
   },
   process.env.JWT_SECRET,
   { expiresIn: "7d" }
 );
}

// ─── Send OTP (used for both register and login) ─────────────────────────────
const sendOTPService = async ({ phone }) => {
    return await sendOTP(phone);
};


// ─── Register Service ──────────────────────────────────────────────────────

const registerService = async ({name, email,password, role})=>{
    
    // 1. Check if email already exists
    const existingUser = await findUserByEmail({ email });
    if (existingUser) {
        throw new ValidationError([{ field: "email", message: "Email already registered" }]);
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create user in DB
    const user = await createUser({ name, email, password: hashedPassword, role });

    // 4. Generate JWT token
    const token = generateToken(user);

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
}


// ─── Login Service ─────────────────────────────────────────────────────────

const loginService = async ({ email, password }) => {

    // 1. Find user by email
    const user = await findUserByEmail({ email });
    if (!user) {
        throw new UnauthorizedError("Invalid email or password");
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new UnauthorizedError("Invalid email or password");
    }

    // 3. Generate JWT token
    const token = generateToken(user);

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};

module.exports = { registerService, loginService };


// ─── Notes ─────────────────────────────────────────────────────────────────
//
// - Service layer handles ALL business logic
// - Never send res/req here — that is controller's job
// - Throw AppError subclasses — controller/global handler catches them
// - bcrypt.hash(password, 10) → 10 is salt rounds
// - Same error message for wrong email and wrong password (security best practice)
//   → prevents attackers from knowing which one was wrong
// - JWT_SECRET must be in .env file
