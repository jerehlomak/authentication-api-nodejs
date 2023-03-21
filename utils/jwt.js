const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
  console.log(payload);
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET
    //     {
    //     expiresIn: process.env.JWT_LIFETIME,
    // }
  );
  return token;
};

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookiesToResponse = ({ res, user, refreshToken }) => {
  // access token
  const accessTokenJWT = createJWT({ payload: { user } });
  // refresh token
  const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });

  const oneDay = 1000 * 60 * 60 * 24;
  const longerExpiration = 1000 * 60 * 60 * 24 * 30

  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + oneDay),
  });

  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + longerExpiration),
  });
};

// const attachSingleCookieToResponse = ({ res, user }) => {
//     const token = createJWT({ payload: user })

//     const oneDay = 1000 * 60 * 60 + 24
//     res.cookie('token', token, {
//         httpOnly: true,
//         expires: new Date(Date.now() + oneDay),
//         secure: process.env.NODE_ENV === 'production',
//         signed: true
//     })
// }

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
};
