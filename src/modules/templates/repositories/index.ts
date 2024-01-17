import { appDataSource } from "../../../datasources"

import { Template } from "../entities/Template";
import { TemplateBallot } from "../entities/TemplateBallot";
import { TemplateStatusSchedule } from "../entities/TemplateStatusSchedule";


export const templateRepository = appDataSource.getRepository(Template);
export const templateBallotRepository = appDataSource.getRepository(TemplateBallot);
export const templateStatusScheduleRepository = appDataSource.getRepository(TemplateStatusSchedule);