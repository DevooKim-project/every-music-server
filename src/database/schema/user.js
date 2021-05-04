const mongoose = require("mongoose");
const { platformTypes } = require("../../config/type");
const { toJSON } = require("./plugins");

const { Schema } = mongoose;
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
  },
  nick: {
    type: String,
  },
  platform: {
    type: String,
    enum: [platformTypes.KAKAO, platformTypes.GOOGLE, platformTypes.SPOTIFY],
  },
  platformId: {
    type: String,
  },
  likePlaylists: [{ type: Schema.Types.ObjectId, ref: "Playlist" }],
  visible: {
    type: Boolean,
    default: true,
  },
});

userSchema.plugin(toJSON);

userSchema.statics.isEmailTaken = async function (email, platform) {
  const user = await this.findOne({ email, platform: { $ne: platform } });
  return !!user; //null -> true -> false
};

module.exports = mongoose.model("User", userSchema);
