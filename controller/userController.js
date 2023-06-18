const mongoose = require('mongoose')
const Users = mongoose.model('Users');

const allDrivers = async (req, res) => {
    try {
        const drivers = await Users.find({ role: "driver", isDeleted: 0, block: false })
        if (drivers?.length > 0) {
            return res.status(200).send({ status: 1, drivers })
        } else {
            return res.status(400).send({ status: 0, message: "Drivers not found" })
        }
    }
    catch (err) {
        return res.status(500).send({ status: 0, message: "Something went wrong" })
    }
}
module.exports = { allDrivers }