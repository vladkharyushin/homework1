import {UserDbType} from "../types/user/output";
import {userCollection} from "../db/db";
import {ObjectId} from "mongodb";

export class UserRepository {
    static async createUser(newUser: UserDbType) {
        const user = await userCollection.insertOne({...newUser});
        newUser._id = user.insertedId
    }

    static async deleteUserById(id: string): Promise<boolean> {
        const result = await userCollection.deleteOne({_id: new ObjectId(id)})
        return !!result.deletedCount
    }

    static async findByLoginOrEmail(loginOrEmail: string) {
        return userCollection.findOne({
            $or: [
                // {email: loginOrEmail},
                // {login: loginOrEmail}
                {
                    email: {
                        $regex: loginOrEmail,
                        $options: "i"
                    }
                },
                {
                    login: {
                        $regex: loginOrEmail,
                        $options: "i"
                    }
                }
            ]
        })
    }

    static async findByConfirmationCode (code: string) {
        const user = await userCollection.findOne({'emailConfirmation.confirmationCode': code})
        return user
    }

    static async updateConfirmation(_id: ObjectId) {
        let result = await userCollection.updateOne(
            {_id},
            {$set: {'emailConfirmation.isConfirmed': true}}
        )
        return result.modifiedCount === 1
    }

    static async updateConfirmationCode(id: string, code: string) {

    }
}