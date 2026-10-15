import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const RefreshTokens = sequelize.define("refresh_tokens", {
    id: {
        type: DataTypes.INTEGER,
       autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false
    },

}, {
    tableName: "refresh_tokens",
    timestamps: true
})

export default RefreshTokens