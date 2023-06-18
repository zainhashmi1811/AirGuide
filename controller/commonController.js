const mongoose = require('mongoose')
const Users = mongoose.model('Users');
const bcrypt = require('bcrypt');

const signUp = async (req, res) => {
    try {
        const { email, password, confirmPassword, name, role } = req.body;
        const ex = await Users.findOne({ email: email?.toLowerCase(), role })
        const emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        const pass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&.])[A-Za-z\d@$!%#*?&.]{8,}$/
        if (!role) {
            return res.status(400).send({ status: 0, message: "Role field can't be empty" })
        } else if (role != "user" && role != "driver") {
            return res.status(400).send({ status: 0, message: "Invalid role" })
        }
        else if (!name) {
            return res.status(400).send({ status: 0, message: "Name field can't be empty" })
        }
        else if (!email) {
            return res.status(400).send({ status: 0, message: "Email field can't be empty" })
        }
        else if (!email.match(emailValidation)) {
            return res.status(400).send({ status: 0, message: "Invalid email address" })
        }
        else if (ex) {
            return res.status(400).send({ status: 0, message: `Email Already Exist` })
        }
        else if (!password) {
            return res.status(400).send({ status: 0, message: "Password field can't be empty" })
        }
        else if (!password.match(pass)) {
            return res.status(400).send({ status: 0, message: "Password should be 8 characters long (should contain uppercase, lowercase, numeric and special character)" })
        }
        else if (!confirmPassword) {
            return res.status(400).send({ status: 0, message: "Confirm Password field can't be empty" })
        }
        else if (!confirmPassword.match(pass)) {
            return res.status(400).send({ status: 0, message: "Password and Confirm Password must be same" })
        }
        else if (password != confirmPassword) {
            return res.status(400).send({ status: 0, message: "Password and Confirm Password must be same" })
        }
        else if (!req.file) {
            return res.status(400).send({ status: 0, message: "Image field can't be empty" })
        }
        else {
            const user = new Users({
                email, password, name, role, imageName: req.file ? req.file.path : null,
            });
            await user.save();
            return res.status(200).send({ status: 1, message: "Account Created Successfully", data: user })
        }
    }
    catch (err) {
        return res.status(500).send({ status: 0, message: "Something went wrong" })
    }
}

const signIn = async (req, res) => {
    try {
        const { email, password, role, deviceToken, deviceType, lat, long, address } = req.body
        const emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        if (!role) {
            return res.status(400).send({ status: 0, message: "Role field can't be empty" })
        } else if (role != "user" && role != "driver") {
            return res.status(400).send({ status: 0, message: "Invalid role" })
        } if (!email) {
            return res.status(400).send({ status: 0, message: "Email field can't be empty" })
        }
        else if (!email.match(emailValidation)) {
            return res.status(400).send({ status: 0, message: "Invalid email address" })
        }
        const user = await Users.findOne({ email: email?.toLowerCase(), role })
        if (!user) {
            return res.status(400).send({ status: 0, message: "User not found" })
        }
        else if (!password) {
            return res.status(400).send({ status: 0, message: "Password field can't be empty" })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({ status: 0, message: "Password is not valid" });
        }
        else if (!lat || !long) {
            return res.status(400).send({ status: 0, message: "Location field can't be empty" });
        } else if (!address) {
            return res.status(400).send({ status: 0, message: "Address field can't be empty" });
        }
        else {
            await user.generateAuthToken();
            user.user_device_token = deviceToken
            user.user_device_type = deviceType
            user.address = address
            user.location.type = "Point",
                user.location.coordinates = [long ? parseFloat(long) : 0, lat ? parseFloat(lat) : 0]
            await user.save()
            res.status(200).send({ status: 1, message: "Login Successfully", data: user })
        }

    } catch (err) {
        return res.status(500).send({ status: 0, message: "Something went wrong" })
    }
}

const signOut = async (req, res) => {
    try {
        const { role } = req.body;
        if (!role) {
            return res.status(400).send({ status: 0, message: "Role field can't be empty" })
        } else if (role != "user" && role != "driver") {
            return res.status(400).send({ status: 0, message: "Invalid role" })
        }
        const user = await Users.findOne({ _id: req.user._id, role })
        if (!user) {
            return res.status(400).send({ status: 0, message: "User not found" })
        } else {
            user.token = null
            user.save()
            res.status(200).send({ status: 1, message: "User Logged Out" })
        }
    } catch (err) {
        return res.status(500).send({ status: 0, message: "Something went wrong" })
    }
}

module.exports = { signUp, signIn, signOut }