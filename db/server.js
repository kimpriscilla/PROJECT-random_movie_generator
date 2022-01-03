const Sequelize = require("sequelize");
const { STRING, INTEGER } = Sequelize;
const db = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost/project1"
);
const faker = require("faker");
//console.log(faker.company.companyName());

const Movie = db.define("movie", {
  name: STRING,
  rating: {
    type: INTEGER,
    validate: {
      max: 5,
      min: 1,
    },
    defaultValue: 3,
  },
});

Movie.randomMovie = function () {
  return this.create({ name: `${faker.company.companyName()}` });
};

const syncAndSeed = async () => {
  await db.sync({ force: true });
  await Promise.all([
    Movie.create({ name: faker.company.companyName() }),
    Movie.create({
      name: faker.company.companyName(),
    }),
    Movie.create({ name: faker.company.companyName() }),
  ]);
};

module.exports = {
  syncAndSeed,
  models: {
    Movie,
  },
};
