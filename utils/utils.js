const { default: axios } = require("axios");
 var serverKey = "Put Server Key Here"; //put your server key here
 
const pushNotifications = async (payload) => {
    console.log(payload)
    try {
        const response = await axios.post('https://fcm.googleapis.com/fcm/send', payload, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `key=${serverKey}`,
            },
        });
        console.log('Notification sent successfully:', response.data);
    } catch (error) {
        console.error('Error sending notification:', error);
    } 
};


module.exports = { pushNotifications } 