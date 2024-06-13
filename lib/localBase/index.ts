import { User, Course, Unit, Chapter, Progress } from "@/app/@types/models";
import db from "./db";

// Add data to a collection
export function addData<T>(collectionName: string, data: T): Promise<void> {
    return db.collection(collectionName).add(data);
  }
  
  // Get all data from a collection
  export function getData<T>(collectionName: string): Promise<T[]> {
    return db.collection(collectionName).get();
  }
  
  // Get data by ID from a collection
  export function getDataById<T>(collectionName: string, id: string): Promise<T | undefined> {
    return db.collection(collectionName).doc({ id }).get();
  }
  
  // Update data in a collection
  export function updateData<T>(collectionName: string, id: string, data: Partial<T>): Promise<void> {
    return db.collection(collectionName).doc({ id }).update(data);
  }
  
  // Delete data from a collection
  export function deleteData(collectionName: string, id: string): Promise<void> {
    return db.collection(collectionName).doc({ id }).delete();
  }