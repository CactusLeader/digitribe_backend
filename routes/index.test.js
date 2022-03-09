const app = require("../app");
const request = require("supertest");

test("recup point", async () => {
  const res = await request(app).post("/map").send({
    currentLongitude: 7.26,
    currentLatitude: 43.7,
  });
  // expect(typeof res.body.description).toEqual("string");
  expect(typeof res.body.places).toEqual("object");
});

test("lorsque la coordonnée est invalide", async () => {
  await request(app)
    .post("/map")
    .send({
      currentLongitude: 0,
    })
    .expect({
      result: false,
    });
});

<<<<<<< HEAD
test("quand personne ne se trouve à proximité", async (done) => {
  await request(app)
    .get("/map")
    .query({
      coordinate: {
        lat: 43.6,
        lon: 7.24,
      }
    })
    .expect({
      result: false,
      error: "Personne ne se trouve à proximité",
    });
  done();
=======
test("quand personne ne se trouve à proximité", async () => {
  const res = await request(app).post("/map").send({
    currentLongitude: 0,
    currentLatitude: 0,
  });
  expect(res.body.error).toEqual("Personne ne se trouve à proximité");
>>>>>>> test
});
