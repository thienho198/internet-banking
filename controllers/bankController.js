const axios = require('axios');
const md5 = require('md5');
exports.getRgpBank = async (req, res, next) => {
  try {
    console.log(req.body);
    let timestamp = Date.now();
    let sig = md5(timestamp + req.body + 'hPZno63KBfZeIcvYLDwx');
    const response = await axios.get(
      'https://salty-meadow-17297.herokuapp.com/customer/query_information',
      {
        headers: {
          company_id: 'TttwVLKHvXRujyllDq',
          timestamp: timestamp,
          'x-signature': sig,
        },
      }
    );
    console.log(response);
  } catch (error) {
    console.error(error);
  }
  res.json({ success: true });
};
