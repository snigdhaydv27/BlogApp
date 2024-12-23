const mongoose = require("mongoose");
const { createHmac, randomBytes } = require("crypto");

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        salt: {
            type: String,
        },
        password: {
            type: String,
            required: true,
        },
        profileImageURL: {
            type: String,
            default: "/images/default.png",
        },
        role: {
            type: String,
            enum: ["USER", "ADMIN"],
            default: "USER",
        },
    },
    { timestamps: true }
);

// Pre-save hook for password hashing
userSchema.pre("save", function (next) {
    const user = this;
    if (!user.isModified("password")) return next();

    try {
        const salt = randomBytes(16).toString("hex");
        const hashedPassword = createHmac("sha256", salt)
            .update(user.password)
            .digest("hex");
        user.salt = salt;
        user.password = hashedPassword;

        next();
    } catch (error) {
        console.error("Error in pre-save hook:", error);
        next(error);
    }
});

// Static method for password matching
userSchema.static("matchPassword", async function (email, password) {
    if (!email || !password) {
        throw new Error("Email and password must be provided!");
    }

    const user = await this.findOne({ email });
    if (!user) {
        throw new Error("User not found with the given email!");
    }

    const salt = user.salt;
    const hashedPassword = user.password;
    const userProvideHash = createHmac("sha256", salt)
        .update(password)
        .digest("hex");

    if (hashedPassword !== userProvideHash) {
        throw new Error("Incorrect password provided!");
    }

    return user;
});

const User = mongoose.model("User", userSchema);

module.exports = User;
