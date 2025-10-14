import { appDataSource } from "../../../datasources"
import { AppDownloadUrl } from "../entities/AppDownloadUrl";


export const appDownloadUrlRepository = appDataSource.getRepository(AppDownloadUrl);

