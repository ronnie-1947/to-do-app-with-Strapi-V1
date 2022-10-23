"use strict"

/**
 * todo controller
 */

const { createCoreController } = require("@strapi/strapi").factories

module.exports = createCoreController("api::todo.todo", ({ strapi }) => ({
  async create(ctx) {
    try {
      const { id } = ctx.state.user

      // Create Task
      const entry = await strapi.entityService.create("api::todo.todo", {
        data: {
          ...ctx.request.body,
          userId: id,
          user: id,
          publishedAt: new Date()
        }
      })

      // Send 200 response
      ctx.body = entry

    } catch (err) {
      return ctx.badRequest(err.message)
    }
  },

  async find(ctx) {
    try {
      const { id: userId } = ctx?.state?.user
      const { page = 1, limit = 15} = ctx.request.query
      
      // Query Database
      const entry = await strapi.entityService.findMany("api::todo.todo", {
        populate: {
          user: {
            fields: ["id", "username"]
          }
        },
        filters: {
          userId
        },
        sort: { createdAt: "DESC" },
        start: (+page-1) * +limit,
        limit: +limit
      })

      // Send 200 response
      ctx.body = entry

    } catch (err) {
      return ctx.badRequest(err.message)
    }
  },
  
  async findOne(ctx){
    
    try {

      const { id: userId } = ctx?.state?.user
      const {id: taskId} = ctx.request.params

      // Validate permisson for modifying task
      const task = await strapi.service("api::todo.todo").checkModifyPermisson({ userId, taskId })
      if (!task) throw new Error("You are not authorized to make changes")

      // Fetch the task
      const response = await strapi.entityService.findOne('api::todo.todo', taskId, {
        populate: {
          user: {
            fields: ["id", "username"]
          }
        }
      });

      // Send 200 response
      return ctx.body = response;
      
    } catch (err) {
      return ctx.badRequest(err.message)
    }
  },

  async modifyTaskCompletion(ctx) {
    try {
      const { id: userId } = ctx?.state?.user
      const { taskId } = ctx.request.body

      // Validate permisson for modifying task
      const task = await strapi.service("api::todo.todo").checkModifyPermisson({ userId, taskId })
      if (!task) throw new Error("You are not authorized to make changes")

      // Make changes in task
      const response = await strapi.entityService.update("api::todo.todo", taskId, {
        data: {
          completed: !task.completed
        }
      })

      // Send 200 response
      ctx.body = response

    } catch (err) {
      return ctx.badRequest(err.message)
    }
  },
  
  async update(ctx) {
    try {
      const {task: newTask} = ctx.request.body
      const {id: taskId} = ctx.request.params
      const { id: userId } = ctx?.state?.user
      
      // Validate permisson for modifying task
      const task = await strapi.service("api::todo.todo").checkModifyPermisson({ userId, taskId })
      if (!task) throw new Error("You are not authorized to make changes")
      
      // Make changes in task
      const response = await strapi.entityService.update("api::todo.todo", taskId, {
        data: {
          task: newTask
        }
      })
      
      // Send 200 response
      ctx.body = response
      
    } catch (err) {
      return ctx.badRequest(err.message)
    }
  },
  
  async delete(ctx){
    
    try {

      const {id: taskId} = ctx.request.params
      const { id: userId } = ctx?.state?.user
      
      // Validate permisson for modifying task
      const task = await strapi.service("api::todo.todo").checkModifyPermisson({ userId, taskId })
      if (!task) throw new Error("You are not authorized to make changes")

      // Delete Task
      await strapi.entityService.delete('api::todo.todo', taskId);
      ctx.body = "Task removed successfully"

    } catch (err) {
      return ctx.badRequest(err.message)
    }
  }
  
}))
