const express = require("express");

const authRoute = require("./auth");
const convertRoute = require("./convert");
const playlistRoute = require("./playlist");
const userRoute = require("./user");
const trackRoute = require("./track");

const router = express.Router();

const Test = require("../database/schema/test");

const Joi = require("joi");
const { playlistValidation } = require("../validate");
const pick = require("../utils/pick");
router.get("/", (req, res) => {
  const obj = {
    body: {
      playlists: [
        {
          id: "PL7ylSe17PUm4cvbfMfp1QdhI8h6De_niz",
          title: "This is Youtube #2",
          thumbnail: "https://i.ytimg.com/vi/T1pyRXVyEl8/default.jpg",
          description: "",
          owner: {
            name: "김현우",
            id: "UC2JC72aY8XWlRPAVFiguMZQ",
          },
          provider: "youtube",
        },
        {
          id: "PL7ylSe17PUm6i_PN4k6Kv-Ww2vVu8I9SF",
          title: "This is Youtube #1",
          thumbnail: "https://i.ytimg.com/vi/ZAHtwfJrJp0/default.jpg",
          description: "",
          owner: {
            name: "김현우",
            id: "UC2JC72aY8XWlRPAVFiguMZQ",
          },
          provider: "youtube",
        },
      ],
      tracks: [
        [
          {
            title: "Walking In The Rain",
            ids: {
              local: "606f5b5a19504904797ce8ce",
              $init: true,
              youtube: "T1pyRXVyEl8",
            },
            artist: {
              name: "Chancellor",
              ids: {
                local: "606f5b5a19504904797ce8cd",
                $init: true,
                youtube: "UCWMlMGdY-RmfKrN32_DcJhA",
              },
            },
            thumbnail: "https://i.ytimg.com/vi/T1pyRXVyEl8/default.jpg",
          },
          {
            title: "NAN CHUN",
            ids: {
              local: "606f5b5a19504904797ce8d0",
              $init: true,
              youtube: "BFhy52WtO3o",
            },
            artist: {
              name: "SE SO NEON",
              ids: {
                local: "606f5b5a19504904797ce8cf",
                $init: true,
                youtube: "UCZ1tXypKXk2vM1h4DtGWvbg",
              },
            },
            thumbnail: "https://i.ytimg.com/vi/BFhy52WtO3o/default.jpg",
          },
          {
            title: "Monsters (feat. Demi Lovato and blackbear)",
            ids: {
              local: "606f58585e4ff8043fc608e2",
              $init: true,
              spotify: "50DMJJpAeQv4fIpxZvQz2e",
              youtube: "M9cfZrLC6Ug",
            },
            artist: {
              name: "All Time Low",
              ids: {
                local: "606f58585e4ff8043fc608e0",
                $init: true,
                spotify: "46gyXjRIvN1NL1eCB8GBxo",
                youtube: "UCJ0ylbabpqpkROWwqRki_9A",
              },
            },
            thumbnail: "https://i.ytimg.com/vi/M9cfZrLC6Ug/default.jpg",
          },
          {
            title: "Paint You Wings",
            ids: {
              local: "606f5b5a19504904797ce8d2",
              $init: true,
              youtube: "sw8mz81T9nI",
            },
            artist: {
              name: "All Time Low",
              ids: {
                local: "606f58585e4ff8043fc608e0",
                $init: true,
                spotify: "46gyXjRIvN1NL1eCB8GBxo",
                youtube: "UCJ0ylbabpqpkROWwqRki_9A",
              },
            },
            thumbnail: "https://i.ytimg.com/vi/sw8mz81T9nI/default.jpg",
          },
          {
            title: "Good Riddance (Time of Your Life)",
            ids: {
              local: "60634c94fb31e50927cd6262",
              $init: true,
            },
            artist: {
              name: "Green Day",
              ids: {
                local: "60634bb38f459d08fddf44fc",
                $init: true,
                spotify: null,
                youtube: "UC4JNeITH4P7G51C1hJoG6vQ",
              },
            },
            thumbnail: "https://i.ytimg.com/vi/X2TYH_qTGv8/default.jpg",
          },
        ],
        [
          {
            title: "Shiny Star (2020) (밤 하늘의 별을(2020))",
            ids: {
              local: "606f5b5a19504904797ce8d5",
              $init: true,
              youtube: "ZAHtwfJrJp0",
            },
            artist: {
              name: "KyoungSeo",
              ids: {
                local: "606f5b5a19504904797ce8d4",
                $init: true,
                youtube: "UCfnwBweBOXdVtDgr2Q2TC5Q",
              },
            },
            thumbnail: "https://i.ytimg.com/vi/ZAHtwfJrJp0/default.jpg",
          },
          {
            title: "NAN CHUN",
            ids: {
              local: "606f5b5a19504904797ce8d0",
              $init: true,
              youtube: "BFhy52WtO3o",
            },
            artist: {
              name: "SE SO NEON",
              ids: {
                local: "606f5b5a19504904797ce8cf",
                $init: true,
                youtube: "UCZ1tXypKXk2vM1h4DtGWvbg",
              },
            },
            thumbnail: "https://i.ytimg.com/vi/BFhy52WtO3o/default.jpg",
          },
          {
            title: "Monsters (feat. Demi Lovato and blackbear)",
            ids: {
              local: "606f58585e4ff8043fc608e2",
              $init: true,
              spotify: "50DMJJpAeQv4fIpxZvQz2e",
              youtube: "M9cfZrLC6Ug",
            },
            artist: {
              name: "All Time Low",
              ids: {
                local: "606f58585e4ff8043fc608e0",
                $init: true,
                spotify: "46gyXjRIvN1NL1eCB8GBxo",
                youtube: "UCJ0ylbabpqpkROWwqRki_9A",
              },
            },
            thumbnail: "https://i.ytimg.com/vi/M9cfZrLC6Ug/default.jpg",
          },
          {
            title: "Take care",
            ids: {
              local: "606f5b5a19504904797ce8d7",
              $init: true,
              youtube: "OaDKuFfkSMI",
            },
            artist: {
              name: "george",
              ids: {
                local: "606f5b5a19504904797ce8d6",
                $init: true,
                youtube: "UCK9DGUQe7gzpvFayfJ5wGFw",
              },
            },
            thumbnail: "https://i.ytimg.com/vi/OaDKuFfkSMI/default.jpg",
          },
          {
            title: "Dry Flower",
            ids: {
              local: "606f5b5a19504904797ce8d9",
              $init: true,
              youtube: "rplAf-5zOnk",
            },
            artist: {
              name: "SURL",
              ids: {
                local: "606f5b5a19504904797ce8d8",
                $init: true,
                youtube: "UCPbszxOIsiQblDFv01nTHHg",
              },
            },
            thumbnail: "https://i.ytimg.com/vi/rplAf-5zOnk/default.jpg",
          },
        ],
      ],
    },
  };

  const obj2 = {
    body: {
      // a: "123",
      // b: "456",
      c: ["abc", "123"],
    },
  };
  const schema = playlistValidation.convert;
  const validSchema = pick(schema, ["params", "query", "body"]);
  const object = pick(obj, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: "key" } })
    .validate(object);

  res.send({ value, error });
});

router.use("/auth", authRoute);
router.use("/convert", convertRoute);
router.use("/playlist", playlistRoute);
router.use("/track", trackRoute);
router.use("/user", userRoute);

router.use((req, res) => {
  res.status(404).send("Bad request");
});

module.exports = router;
