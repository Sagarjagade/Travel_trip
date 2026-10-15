'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("trips-weather-data", {
    id: {
       allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    trip_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    weather_data: {
      type: Sequelize.JSONB,
      allowNull: false,
    },
    fetched_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    next_refresh_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });

  await queryInterface.addConstraint('trips-weather-data', {
  fields: ['user_id', 'trip_id'],
  type: 'unique',
  name: 'trips_weather_data_user_id_trip_id_unique',
});

await queryInterface.addIndex("trips-weather-data", ["next_refresh_at"], {
    name: "trips_weather_data_next_refresh_at_idx",
  });
}


export async function down(queryInterface) {
  await queryInterface.dropTable("trips-weather-data");
}