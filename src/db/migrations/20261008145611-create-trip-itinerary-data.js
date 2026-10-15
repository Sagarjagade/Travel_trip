'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("trips-itinerary-data", {
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
    itinerary_data: {
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

  await queryInterface.addConstraint('trips-itinerary-data', {
  fields: ['user_id', 'trip_id'],
  type: 'unique',
  name: 'trips_itinerary_data_user_id_trip_id_unique',
});

await queryInterface.addIndex("trips-itinerary-data", ["next_refresh_at"], {
    name: "trips_itinerary_data_next_refresh_at_idx",
  });
}


export async function down(queryInterface) {
  await queryInterface.dropTable("trips-itinerary-data");
}