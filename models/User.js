const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

// create our User model
class User extends Model {}

// define table columns and configuration
User.init(
    {
        // (TABLE COLUMN DEFS GO HERE)
        // define an id column 
        id: {
            // use the special Sequelize DataTypes object provide what tye of data it is
            type: DataTypes.INTEGER,
            // allowNull false = MySQL 'NOT NULL'
            allowNull: false,
            // instruct that this is the Primary Key
            primaryKey: true,
            // turn on auto increment
            autoIncrement: true
        },
        
        // define username column
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        
        // define an email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            //there cannot be any duplicate email values in this table
            unique: true,
            // if allowNull is set to false, we can run our data through validator
            validate: {
                isEmail: true
            }
        },
        
        // define password column 
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // set min number of password chars long
                len: [4]
            }
        }

    },
    {
        // TABLE CONFIG OPTIONS GO HERE 
        // hooks used to encrypt password
        hooks: {
            // set up beforeCreate lifecycle "hook" functionality
            
            // beforeCreate(userData) {
            //     return bcrypt.hash(userData.password, 10).then(newUserData => {
            //         return newUserData;
            //     });
            // }

            // using async/await
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10)
                return updatedUserData;
            }
        },
        sequelize,
        // don't automatically create createAT/updateAt timestamps fields
        timestamps: false,
        // don't pluralize name of database table
        freezeTableName: true,
        // use underscores instead of camel-casing
        underscored: true,
        // make it so our model name stays lowercase in the database
        modelName: 'user'
    }
);

module.exports = User;