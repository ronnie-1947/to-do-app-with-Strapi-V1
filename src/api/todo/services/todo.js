"use strict"

/**
 * todo service
 */

const { createCoreService } = require("@strapi/strapi").factories

module.exports = createCoreService("api::todo.todo", ({ strapi }) => ({
  
  async checkModifyPermisson({ userId, taskId }) {
    const task = await strapi.entityService.findOne("api::todo.todo", taskId)
    if (task?.userId === userId) return task

    return null
  }
}))
