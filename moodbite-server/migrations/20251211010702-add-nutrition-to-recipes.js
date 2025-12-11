"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.addColumn("Recipes", "calories", {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn("Recipes", "protein", {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn("Recipes", "fat", {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn("Recipes", "readyInMinutes", {
      type: Sequelize.STRING,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.removeColumn("Recipes", "calories");
    await queryInterface.removeColumn("Recipes", "protein");
    await queryInterface.removeColumn("Recipes", "fat");
    await queryInterface.removeColumn("Recipes", "readyInMinutes");
  },
};
