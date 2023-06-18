const mongoose = require('mongoose')
const Users = mongoose.model('Users');

const driverLocation = async (object, callback) => {
    try {
        const user = await Users.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(object?.driverId),
                    role: "driver"
                }
            }
        ])
        callback(user)
    } catch (error) {
        callback(error)
    }
}

module.exports = {
    driverLocation,
}