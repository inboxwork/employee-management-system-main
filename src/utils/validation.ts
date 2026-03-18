import Joi from "joi";
import { EditUserData, ReassignReason, RegisterUser, Task } from "./types";

export function validateRegister(data: RegisterUser) {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).max(255).required(),
    email: Joi.string().trim().min(3).email().required(),
    password: Joi.string().trim().min(6).max(255).required(),
    role: Joi.string().trim().required(),
  });
  return schema.validate(data);
}

export function validateEditUserData(data: EditUserData) {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).max(255),
    password: Joi.string().trim().min(6).max(255),
    role: Joi.string().trim(),
  });
  return schema.validate(data);
}

export function validateLogin(data: { email: string; password: string }) {
  const schema = Joi.object({
    email: Joi.string().trim().min(3).email().required(),
    password: Joi.string().trim().min(6).max(255).required(),
  });
  return schema.validate(data);
}

export function validateChangePassword(data: { newPassword: string }) {
  const schema = Joi.object({
    newPassword: Joi.string().trim().min(6).max(255).required(),
  });
  return schema.validate(data);
}

export function validateAddTask(data: Partial<Task>) {
  const schema = Joi.object({
    title: Joi.string().trim().min(2).required(),
    description: Joi.string().trim().min(3).required(),
    startDate: Joi.string().trim().required(),
    endDate: Joi.string().trim().required(),
    priority: Joi.string().trim().required(),
    price: Joi.number().required(),
    currency: Joi.string().required(),
  });
  return schema.validate(data);
}

export function validateEditTask(data: Partial<Task>) {
  const schema = Joi.object({
    title: Joi.string().trim().min(2),
    description: Joi.string().trim().min(3),
    startDate: Joi.string().trim(),
    endDate: Joi.string().trim(),
    priority: Joi.string().trim(),
    price: Joi.number(),
    currency: Joi.string(),
  });
  return schema.validate(data);
}

export function validateReassignReason(data: Partial<ReassignReason>) {
  const schema = Joi.object({
    startDate: Joi.string().trim().required(),
    endDate: Joi.string().trim().required(),
    reassignReason: Joi.string().trim(),
  });
  return schema.validate(data);
}
