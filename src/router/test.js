const PlayList = require("../database/schema/playlist");
const Track = require("../database/schema/track");
const Album = require("../database/schema/album");
const Artist = require("../database/schema/artist");
const track = require("../database/schema/track");

const test = async () => {
  try {
    await PlayList.deleteMany({});
    await Track.deleteMany({});
    await Album.deleteMany({});
    await Artist.deleteMany({});

    const playList = await PlayList.create({
      title: "playlist",
    });

    const track1 = await Track.create({
      title: { kor: "트랙1", eng: "track1" },
    });
    const track2 = await Track.create({
      title: { kor: "트랙2", eng: "track2" },
    });
    const track3 = await Track.create({
      title: { kor: "트랙3", eng: "track3" },
    });

    const artist1 = await Artist.create({
      name: "artist1",
    });
    const artist2 = await Artist.create({
      name: "artist2",
    });
    const artist3 = await Artist.create({
      name: "artist3",
    });

    const album = await Album.create({
      title: { kor: "앨범", eng: "album" },
    });

    await PlayList.updateOne(
      {
        title: "playlist",
      },
      {
        $addToSet: { tracks: { $each: [track1.id, track2.id] } },
      }
    );

    await Album.updateOne(
      {
        "title.kor": "앨범",
      },
      {
        $addToSet: {
          tracks: { $each: [track1.id, track3.id] },
          artists: artist1.id,
        },
      }
    );
    await Track.updateOne(
      {
        "title.kor": "트랙1",
      },
      {
        $addToSet: { artists: artist1.id },
      }
    );
    await Track.updateOne(
      {
        "title.eng": "track2",
      },
      {
        $addToSet: { artists: artist2.id },
      }
    );
    await Track.updateOne(
      {
        "title.kor": "트랙3",
      },
      {
        $addToSet: { artists: { $each: [artist1.id, artist3.id] } },
      }
    );

    const a = await PlayList.find({}).populate("tracks", "title");
    const b = await Track.find({
      // artists: { $all: artist1.id },
      artists: artist1.id,
    }).populate("artists", "name");
    const c = await Artist.find({});
    console.log(b);
    return b;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

module.exports = test;
