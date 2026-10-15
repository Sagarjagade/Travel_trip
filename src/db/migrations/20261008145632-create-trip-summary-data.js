'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("trips-summary_tips-data", {
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
    summary_data: {
      type: Sequelize.JSONB,
      allowNull: false,
    },
    tips_data: {
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

  await queryInterface.addConstraint('trips-summary_tips-data', {
  fields: ['user_id', 'trip_id'],
  type: 'unique',
  name: 'trips_summary_tips_data_user_id_trip_id_unique',
});

await queryInterface.addIndex("trips-summary_tips-data", ["next_refresh_at"], {
    name: "trips_summary_tips_data_next_refresh_at_idx",
  });
}


export async function down(queryInterface) {
  await queryInterface.dropTable("trips-itinerary-data");
}