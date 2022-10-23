"use strict"

/**
 * todo service
 */

const { createCoreService } = require("@strapi/strapi").factories

module.exports = createCoreService("api::todo.todo", ({ strapi }) => ({

  async checkModifyPermisson({ userId, taskId }) {

    // Find specifig task with ID 
    const task = await strapi.entityService.findOne("api::todo.todo", taskId)

    // If authorized return task
    if (task?.userId === userId) return task

    // If unauthorized return null
    return null
  }
}))
