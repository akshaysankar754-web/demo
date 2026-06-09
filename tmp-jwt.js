const jwt = require('jsonwebtoken');
const secret = 'THIS_IS_MY_SUPER_SECRET_KEY_12345';
const token = jwt.sign({
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': '3',
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': 'akshay139@gmail.com',
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': 'Student'
}, secret, {
  issuer: 'InternshipPortal',
  audience: 'InternshipPortalUsers',
  expiresIn: '1h'
});
console.log(token);
