'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("trips", {
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
    from_station_city: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    from_station_country: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    to_station_city: {
      type: Sequelize.STRING,
      allowNull: false,
    },
     to_station_country: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    start_date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    to_date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    budget: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    travellers: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    expires_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  });

  await queryInterface.addIndex('trips', ['user_id'], {
    name: 'trips_user_id_idx',
  });

  await queryInterface.addIndex('trips', ['start_date','to_date'], {
    name: 'trips_travel_date_idx',
  });

  await queryInterface.addIndex('trips', ['expires_at'], {
    name: 'trips_expires_at_idx',
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("trips");
}