const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        siteName: { type: String, required: true },
        siteUrl: { type: String },
        iconUrl: { type: String },
        username: { type: String }, 
        password: { type: String, required: true }, 

        // Audit trail for CRUD events
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date },
        accessedAt: { type: Date }, 
    },
    { timestamps: true } 
);

// Middleware to update `updatedAt` and `accessedAt` timestamps
passwordSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

passwordSchema.pre('findOneAndUpdate', function (next) {
    this.set({ updatedAt: Date.now() });
    next();
});

passwordSchema.pre('find', function (next) {
    this.set({ accessedAt: Date.now() });
    next();
});

module.exports = mongoose.model('Password', passwordSchema);
