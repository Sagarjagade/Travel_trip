import express from 'express'
const routes = express.Router();
import {createTravelPlan,saveTripPlan,tripList,tripListBasedId,tripPlannerBasedId} from '../controllers/trip.controller.js'
import {validate} from '../middleware/validate.js'
import {travelRequestSchema} from '../validators/travel.validator.js'
import {verifyJWTToken} from '../utils/jwt.js'


routes.use('/plan',verifyJWTToken,validate(travelRequestSchema),createTravelPlan)

routes.use('/save_trip',verifyJWTToken,saveTripPlan)

routes.use('/trip_list_api',verifyJWTToken,tripList)

routes.use('/trip_list_api_based_id',verifyJWTToken,tripListBasedId)

routes.use('/trip_planner_based_id',verifyJWTToken,tripPlannerBasedId)

export default routes