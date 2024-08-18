import db from "../Models/index.js";

const User = db.users;

const saveUser = async (req, res, next) => {
  try {
    const username = await User.findOne({
      where: {
        userName: req.body.userName,
      },
    });
    if (username) {
      return res.status(409).json({
        success: false,
        message: "Bu kullanıcı adı zaten mevcut.",
      });
    }

    const emailcheck = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (emailcheck) {
      return res.status(409).json({
        success: false,
        message: "Bu email zaten mevcut.",
      });
    }

    next();
  } catch (error) {
    console.log(error);
  }
};

export { saveUser };
