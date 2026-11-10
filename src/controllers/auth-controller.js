
const { registerService, loginService } = require("../services/auth-service");

// ─── Register Controller ───────────────────────────────────────────────────

const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        const result = await registerService({ name, email, password, role });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            token: result.token,
            user: result.user,
        });

    } catch (error) {
        next(error);
    }
};

// ─── Login Controller ──────────────────────────────────────────────────────

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const result = await loginService({ email, password });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token: result.token,
            user: result.user,
        });

    } catch (error) {
        next(error);
    }
};

module.exports = { register, login };


// ─── Notes ─────────────────────────────────────────────────────────────────
//
// - Controller only extracts data from req and sends res
// - All logic is delegated to service layer
// - Errors are passed to next(error) → global error handler catches them
// - 201 for register (resource created), 200 for login








