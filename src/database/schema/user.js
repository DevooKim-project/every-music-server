const mongoose = require("mongoose");
const { platformTypes } = require("../../config/type");

const { Schema } = mongoose;
const userSchema = new Schema({
  email: {
    type: String,
    // unique: true,
  },
  nick: {
    type: String,
  },
  provider: {
    name: {
      type: String,
      enum: [platformTypes.KAKAO, platformTypes.GOOGLE, platformTypes.SPOTIFY],
      lowercase: true,
    },
    id: String,
  },
  like_playlists: [{ type: Schema.Types.ObjectId, ref: "Playlist" }],
  private: {
    type: Boolean,
    default: false,
  },
  // token: { type: Schema.Types.ObjectId, ref: "Token" },
});

userSchema.statics.isEmailTaken = async function (email) {
  const user = await this.findOne({ email });
  return !!user; //null -> true -> false
};

module.exports = mongoose.model("User", userSchema);
