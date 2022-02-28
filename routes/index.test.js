const app = require("../app");
const request = require("supertest");

test("recup point", async (done) => {
  const res = await request(app)
    .get("/map")
    .query({
      coordigitnate: {
        lat: 47.3,
        lon: 6.2,
      },
    });
  expect(typeof res.body.description).toEqual("string");
  expect(typeof res.body.coordinate).toEqual("object");
  done();
});

test("lorsque la coordonnée est invalide", async (done) => {
  await request(app)
    .get("/map")
    .query({
      coordinate: null,
    })
    .expect({
      result: false,
    });
  done();
});

test("quand personne ne se trouve à proximité", async (done) => {
  await request(app)
    .get("/map")
    .query({
      coordinate: {
        lat: 43.6,
        lon: 7.24,
      },
    })
    .expect({
      result: false,
      error: "Personne ne se trouve à proximité",
    });
  done();
});
