const User = require("../models/user");

// ─── Find User by Email ────────────────────────────────────────────────────
// Used in: login (check if user exists)
// Used in: register (check if email already taken)

const findUserByEmail = async ({email}) =>{
     return await User.findOne({ email });
}

// ─── Find User by ID ───────────────────────────────────────────────────────
// Used in: auth middleware (verify token and attach user to req)


const findUserById = async (id) => {
    return await User.findById(id).select("-password");
};


// ─── Create User ───────────────────────────────────────────────────────────
// Used in: register
// Password is already hashed before calling this

const createUser = async ({ name, email, password, role }) => {
    const user = new User({ name, email, password, role });
    return await user.save();
};

module.exports = {
    findUserByEmail,
    findUserById,
    createUser,
};


// ─── Notes ─────────────────────────────────────────────────────────────────
//
// - Repository layer only does DB operations, no business logic here
// - Hashing, token generation etc. goes in service layer
// - .select("-password") removes password from returned user object
// - All functions are async — always await them in service layer
