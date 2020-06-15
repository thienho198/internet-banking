const axios = require('axios');
const md5 = require('md5');
exports.getRgpBank = async (req, res, next) => {
  try {
    console.log(req.body);
    let timestamp = Date.now();
    let sig = md5(timestamp + req.body + 'ThisKeyForHash');
    const response = await axios.post(
      'https://salty-meadow-17297.herokuapp.com/customer/query_information',
      req.body,
      {
        headers: {
          company_id: 'pawGDX1Ddu',
          timestamp: timestamp,
          'x-signature': sig,
        },
      }
    );
    res.json({ success: true, data: response.data.data });
    console.log(response);
  } catch (error) {
    res.json({ success: false });
    console.error(error);
  }
};
